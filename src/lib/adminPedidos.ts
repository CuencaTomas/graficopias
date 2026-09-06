import { prisma } from "@/lib/prisma";
import { ESTADOS_COLA_ACTIVA } from "@/lib/estadoPedido";

export async function obtenerPedidosActivos() {
  return prisma.pedido.findMany({
    where: { estado: { in: ESTADOS_COLA_ACTIVA } },
    include: { items: { include: { producto: true } } },
    orderBy: { creadoEn: "asc" },
  });
}

export async function obtenerPedidosEntregados() {
  return prisma.pedido.findMany({
    where: { estado: "ENTREGADO" },
    include: { items: { include: { producto: true } } },
    orderBy: { entregadoEn: "desc" },
  });
}

export type PedidoConItems = Awaited<ReturnType<typeof obtenerPedidosActivos>>[number];

export async function contarPedidos() {
  const [activos, entregados] = await Promise.all([
    prisma.pedido.count({ where: { estado: { in: ESTADOS_COLA_ACTIVA } } }),
    prisma.pedido.count({ where: { estado: "ENTREGADO" } }),
  ]);
  return { activos, entregados };
}
