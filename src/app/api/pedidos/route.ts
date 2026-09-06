import { NextResponse } from "next/server";
import { z } from "zod";
import { crearPedido } from "@/lib/pedidos";

const crearPedidoSchema = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().positive(),
  valorOpcionIds: z.array(z.string()),
  quiereDiseno: z.boolean(),
  comentario: z.string().max(1000).optional(),
  nombreCliente: z.string().min(1).max(200),
  medioContacto: z.enum(["TELEFONO", "EMAIL"]),
  contacto: z.string().min(1).max(200),
  esPagoTotal: z.boolean(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = crearPedidoSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { pedido, montoAPagarAhora } = await crearPedido(parsed.data);
    return NextResponse.json({
      pedidoId: pedido.id,
      montoTotal: Number(pedido.montoTotal),
      montoAPagarAhora,
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "No se pudo crear el pedido";
    return NextResponse.json({ error: mensaje }, { status: 400 });
  }
}
