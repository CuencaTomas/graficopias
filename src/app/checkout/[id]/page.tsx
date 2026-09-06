import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { formatearPrecio } from "@/lib/format";
import { calcularMontoAPagarAhora } from "@/lib/pedidos";
import { mercadopagoConfigurado } from "@/lib/mercadopago";
import { PagarButton } from "./PagarButton";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { items: { include: { producto: true } } },
  });

  if (!pedido) notFound();

  const montoAPagarAhora = calcularMontoAPagarAhora({
    montoTotal: Number(pedido.montoTotal),
    esPagoTotal: pedido.esPagoTotal,
  });

  const yaConfirmado = pedido.estado !== "PENDIENTE_PAGO" && pedido.estado !== "CANCELADO";
  const cancelado = pedido.estado === "CANCELADO";

  return (
    <div className="flex min-h-full flex-col bg-blanco">
      <SiteHeader />
      <div className="mx-auto w-full max-w-lg px-4 py-10">
        <h1 className="text-2xl font-bold text-negro">Checkout</h1>

        <div className="mt-6 rounded-xl border border-black/10 p-5">
          <h2 className="font-semibold text-negro">{pedido.items[0]?.producto.nombre}</h2>
          <p className="text-sm text-black/60">Cantidad: {pedido.items[0]?.cantidad}</p>
          <p className="mt-3 font-bold text-negro">Total del pedido: {formatearPrecio(Number(pedido.montoTotal))}</p>
          <p className="text-sm text-black/60">
            {pedido.esPagoTotal ? "Pagás el total ahora." : "Pagás una seña ahora, el resto al retirar."}
          </p>
        </div>

        <div className="mt-6">
          {cancelado ? (
            <p className="rounded-lg bg-black/5 p-4 text-sm text-black/60">Este pedido fue cancelado.</p>
          ) : yaConfirmado ? (
            <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              ¡Pago confirmado! Ya avisamos a Graficopias y tu pedido entró en preparación.
            </p>
          ) : !mercadopagoConfigurado() ? (
            <p className="rounded-lg bg-black/5 p-4 text-sm text-black/60">
              El cobro con Mercado Pago todavía no está configurado en este ambiente. Monto pendiente:{" "}
              {formatearPrecio(montoAPagarAhora)}.
            </p>
          ) : (
            <PagarButton pedidoId={pedido.id} monto={montoAPagarAhora} />
          )}
        </div>
      </div>
    </div>
  );
}
