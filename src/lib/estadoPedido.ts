import type { EstadoPedido } from "@prisma/client";

/** Estados que forman la cola activa, en orden de avance. */
export const SECUENCIA_ESTADOS: EstadoPedido[] = [
  "SENADO",
  "EN_PREPARACION",
  "COMENZADO",
  "TERMINADO",
  "ENTREGADO",
];

export const ESTADOS_COLA_ACTIVA: EstadoPedido[] = [
  "SENADO",
  "EN_PREPARACION",
  "COMENZADO",
  "TERMINADO",
];

export function siguienteEstado(actual: EstadoPedido): EstadoPedido | null {
  const idx = SECUENCIA_ESTADOS.indexOf(actual);
  if (idx === -1 || idx === SECUENCIA_ESTADOS.length - 1) return null;
  return SECUENCIA_ESTADOS[idx + 1];
}

export function etiquetaEstado(estado: EstadoPedido): string {
  const etiquetas: Record<EstadoPedido, string> = {
    PENDIENTE_PAGO: "Pendiente de pago",
    SENADO: "Señado",
    EN_PREPARACION: "En preparación",
    COMENZADO: "Comenzado",
    TERMINADO: "Terminado",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado",
  };
  return etiquetas[estado];
}

export function colorEstado(estado: EstadoPedido): string {
  const colores: Record<EstadoPedido, string> = {
    PENDIENTE_PAGO: "bg-gray-100 text-gray-600",
    SENADO: "bg-blue-100 text-blue-700",
    EN_PREPARACION: "bg-amber-100 text-amber-700",
    COMENZADO: "bg-purple-100 text-purple-700",
    TERMINADO: "bg-green-100 text-green-700",
    ENTREGADO: "bg-gray-100 text-gray-600",
    CANCELADO: "bg-red-100 text-red-700",
  };
  return colores[estado];
}
