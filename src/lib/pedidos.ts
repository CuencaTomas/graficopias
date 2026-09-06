import { prisma } from "@/lib/prisma";
import { calcularSubtotal } from "@/lib/pricing";
import { SENA_PORCENTAJE } from "@/lib/sena";
import { MedioContacto } from "@prisma/client";

export function calcularMontoAPagarAhora(pedido: { montoTotal: number; esPagoTotal: boolean }): number {
  return pedido.esPagoTotal
    ? pedido.montoTotal
    : Math.round(pedido.montoTotal * SENA_PORCENTAJE * 100) / 100;
}

export type CrearPedidoInput = {
  productoId: string;
  cantidad: number;
  valorOpcionIds: string[];
  quiereDiseno: boolean;
  comentario?: string;
  nombreCliente: string;
  medioContacto: MedioContacto;
  contacto: string;
  esPagoTotal: boolean;
};

export async function crearPedido(input: CrearPedidoInput) {
  const producto = await prisma.producto.findUnique({
    where: { id: input.productoId, activo: true },
    include: { tramosPrecio: true },
  });
  if (!producto) throw new Error("Producto no encontrado");

  const valoresOpcion = input.valorOpcionIds.length
    ? await prisma.valorOpcion.findMany({ where: { id: { in: input.valorOpcionIds } } })
    : [];

  const opcionesParaCalculo = valoresOpcion.map((v) => ({
    valorOpcionId: v.id,
    tipoModificador: v.tipoModificador,
    valorModificador: Number(v.valorModificador),
  }));

  const montoTotal = calcularSubtotal(
    {
      tipoCalculo: producto.tipoCalculo,
      precioBase: Number(producto.precioBase),
      tramosPrecio: producto.tramosPrecio.map((t) => ({
        cantidadDesde: t.cantidadDesde,
        cantidadHasta: t.cantidadHasta,
        precioUnitario: Number(t.precioUnitario),
      })),
    },
    input.cantidad,
    opcionesParaCalculo
  );

  if (montoTotal <= 0) throw new Error("El pedido no tiene un monto válido");

  const montoAPagarAhora = calcularMontoAPagarAhora({ montoTotal, esPagoTotal: input.esPagoTotal });

  // ItemPedido.cantidad es Int en el schema; para productos por m² se
  // redondea sólo a fin de registro — el monto cobrado usa el valor exacto.
  const cantidadRegistro = Math.max(1, Math.round(input.cantidad));

  const pedido = await prisma.pedido.create({
    data: {
      nombreCliente: input.nombreCliente,
      contacto: input.contacto,
      medioContacto: input.medioContacto,
      estado: "PENDIENTE_PAGO",
      montoTotal,
      esPagoTotal: input.esPagoTotal,
      items: {
        create: [
          {
            productoId: producto.id,
            cantidad: cantidadRegistro,
            precioCalculado: montoTotal,
            quiereDiseno: input.quiereDiseno,
            comentario: input.comentario,
            opciones: {
              create: valoresOpcion.map((v) => ({
                valorOpcionId: v.id,
                modificadorAplicado: v.valorModificador,
              })),
            },
          },
        ],
      },
    },
  });

  return { pedido, montoAPagarAhora };
}
