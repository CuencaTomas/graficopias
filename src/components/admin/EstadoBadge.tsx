import type { EstadoPedido } from "@prisma/client";
import { colorEstado, etiquetaEstado } from "@/lib/estadoPedido";

export function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colorEstado(estado)}`}>
      {etiquetaEstado(estado)}
    </span>
  );
}
