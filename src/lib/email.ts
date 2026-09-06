import { Resend } from "resend";
import { formatearPrecio } from "@/lib/format";

export async function notificarPedidoNuevo(pedido: {
  id: string;
  nombreCliente: string;
  contacto: string;
  montoTotal: number;
  montoSenado: number;
  esPagoTotal: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn("Notificación de pedido nuevo omitida: falta configurar Resend.");
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to,
    subject: `Nuevo pedido — ${pedido.nombreCliente}`,
    html: `
      <h1>Nuevo pedido confirmado</h1>
      <p><strong>Pedido:</strong> ${pedido.id}</p>
      <p><strong>Cliente:</strong> ${pedido.nombreCliente}</p>
      <p><strong>Contacto:</strong> ${pedido.contacto}</p>
      <p><strong>Total:</strong> ${formatearPrecio(pedido.montoTotal)}</p>
      <p><strong>Pagado:</strong> ${formatearPrecio(pedido.montoSenado)} (${
        pedido.esPagoTotal ? "pago total" : "seña"
      })</p>
    `,
  });
}
