import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientePreference, mercadopagoConfigurado } from "@/lib/mercadopago";
import { calcularMontoAPagarAhora } from "@/lib/pedidos";

const bodySchema = z.object({ pedidoId: z.string().min(1) });

export async function POST(request: Request) {
  if (!mercadopagoConfigurado()) {
    return NextResponse.json({ error: "Mercado Pago no está configurado todavía" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const pedido = await prisma.pedido.findUnique({ where: { id: parsed.data.pedidoId } });
  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  if (pedido.estado !== "PENDIENTE_PAGO") {
    return NextResponse.json({ error: "Este pedido ya no está pendiente de pago" }, { status: 409 });
  }

  const montoAPagarAhora = calcularMontoAPagarAhora({
    montoTotal: Number(pedido.montoTotal),
    esPagoTotal: pedido.esPagoTotal,
  });

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  try {
    const preference = await clientePreference().create({
      body: {
        items: [
          {
            id: pedido.id,
            title: `Pedido Graficopias ${pedido.esPagoTotal ? "" : "(seña)"}`.trim(),
            quantity: 1,
            currency_id: "ARS",
            unit_price: montoAPagarAhora,
          },
        ],
        external_reference: pedido.id,
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
        back_urls: {
          success: `${siteUrl}/checkout/${pedido.id}`,
          pending: `${siteUrl}/checkout/${pedido.id}`,
          failure: `${siteUrl}/checkout/${pedido.id}`,
        },
        auto_return: "approved",
      },
    });

    await prisma.pago.create({
      data: {
        pedidoId: pedido.id,
        medioPago: "MERCADO_PAGO",
        tipoPago: pedido.esPagoTotal ? "TOTAL" : "SENA",
        monto: montoAPagarAhora,
        estado: "PENDIENTE",
        mpPreferenceId: preference.id,
        mpExternalReference: pedido.id,
      },
    });

    return NextResponse.json({
      initPoint: preference.init_point ?? preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creando preferencia de Mercado Pago", error);
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 502 });
  }
}
