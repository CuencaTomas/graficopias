import { NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { clientePayment, mercadopagoConfigurado } from "@/lib/mercadopago";
import { notificarPedidoNuevo } from "@/lib/email";

export async function POST(request: Request) {
  if (!mercadopagoConfigurado()) {
    return NextResponse.json({ received: true });
  }

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const type = url.searchParams.get("type") ?? url.searchParams.get("topic");

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (secret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId,
        secret,
      });
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        console.warn("Webhook de Mercado Pago con firma inválida", error.reason);
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
      }
      throw error;
    }
  }

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true });
  }

  const payment = await clientePayment().get({ id: dataId });
  const pedidoId = payment.external_reference;
  if (!pedidoId) return NextResponse.json({ received: true });

  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) return NextResponse.json({ received: true });

  const pago = await prisma.pago.findFirst({
    where: { pedidoId, medioPago: "MERCADO_PAGO" },
    orderBy: { creadoEn: "desc" },
  });
  if (!pago) return NextResponse.json({ received: true });

  const estadoPago =
    payment.status === "approved"
      ? "APROBADO"
      : payment.status === "rejected" || payment.status === "cancelled"
        ? "RECHAZADO"
        : "PENDIENTE";

  await prisma.pago.update({
    where: { id: pago.id },
    data: { estado: estadoPago, mpPaymentId: String(payment.id) },
  });

  // Idempotente: sólo se procesa la confirmación la primera vez que llega aprobado.
  if (estadoPago === "APROBADO" && pedido.estado === "PENDIENTE_PAGO") {
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        estado: "SENADO",
        montoSenado: { increment: Number(pago.monto) },
      },
    });

    await notificarPedidoNuevo({
      id: pedidoActualizado.id,
      nombreCliente: pedidoActualizado.nombreCliente,
      contacto: pedidoActualizado.contacto,
      montoTotal: Number(pedidoActualizado.montoTotal),
      montoSenado: Number(pedidoActualizado.montoSenado),
      esPagoTotal: pedidoActualizado.esPagoTotal,
    });
  }

  return NextResponse.json({ received: true });
}
