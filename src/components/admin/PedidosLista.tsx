import type { PedidoConItems } from "@/lib/adminPedidos";
import { EstadoBadge } from "./EstadoBadge";
import { AvanzarButton } from "./AvanzarButton";
import { formatearPrecio, idCorto, formatearFecha } from "@/lib/format";

function resumenProducto(pedido: PedidoConItems): string {
  const item = pedido.items[0];
  if (!item) return "—";
  return `${item.producto.nombre} × ${item.cantidad}`;
}

export function PedidosLista({ pedidos, activa }: { pedidos: PedidoConItems[]; activa: boolean }) {
  if (pedidos.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-blanco p-6 text-center text-black/50">
        {activa ? "No hay pedidos activos en este momento." : "Todavía no hay pedidos entregados."}
      </p>
    );
  }

  return (
    <>
      {/* Mobile: tarjetas */}
      <div className="flex flex-col gap-3 sm:hidden">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="rounded-xl border border-black/10 bg-blanco p-4">
            <p className="font-semibold text-negro">
              {idCorto(pedido.id)} · {pedido.nombreCliente}
            </p>
            <p className="text-sm text-black/60">{resumenProducto(pedido)}</p>
            <div className="mt-3 flex items-center justify-between">
              <EstadoBadge estado={pedido.estado} />
              {activa ? (
                <AvanzarButton pedidoId={pedido.id} estado={pedido.estado} />
              ) : (
                <span className="text-xs text-black/50">
                  {pedido.entregadoEn ? formatearFecha(pedido.entregadoEn) : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden overflow-x-auto rounded-xl border border-black/10 bg-blanco sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-black/50">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">{activa ? "" : "Entregado"}</th>
              {activa && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-negro">{idCorto(pedido.id)}</span>{" "}
                  <span className="text-black/60">{pedido.nombreCliente}</span>
                </td>
                <td className="px-4 py-3 text-black/70">{resumenProducto(pedido)}</td>
                <td className="px-4 py-3 text-black/70">{formatearPrecio(Number(pedido.montoTotal))}</td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={pedido.estado} />
                </td>
                <td className="px-4 py-3 text-black/50">
                  {!activa && pedido.entregadoEn ? formatearFecha(pedido.entregadoEn) : ""}
                </td>
                {activa && (
                  <td className="px-4 py-3 text-right">
                    <AvanzarButton pedidoId={pedido.id} estado={pedido.estado} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
