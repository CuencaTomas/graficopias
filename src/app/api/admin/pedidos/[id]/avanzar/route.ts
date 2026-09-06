import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siguienteEstado } from "@/lib/estadoPedido";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  const nuevoEstado = siguienteEstado(pedido.estado);
  if (!nuevoEstado) {
    return NextResponse.json({ error: "Este pedido ya no puede avanzar más" }, { status: 409 });
  }

  const pedidoActualizado = await prisma.pedido.update({
    where: { id },
    data: {
      estado: nuevoEstado,
      entregadoEn: nuevoEstado === "ENTREGADO" ? new Date() : undefined,
    },
  });

  return NextResponse.json({ estado: pedidoActualizado.estado });
}
