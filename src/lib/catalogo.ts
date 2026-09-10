import { prisma } from "@/lib/prisma";

export async function obtenerProductosActivos() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: { tramosPrecio: true },
    orderBy: { creadoEn: "asc" },
  });

  return productos.map((p) => {
    const precioDesde =
      p.tipoCalculo === "ESCALONADO"
        ? Math.min(...p.tramosPrecio.map((t) => Number(t.precioUnitario)))
        : Number(p.precioBase);

    return {
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      descripcion: p.descripcion,
      imagenesUrl: p.imagenesUrl,
      tipoCalculo: p.tipoCalculo,
      precioDesde,
    };
  });
}

export async function obtenerProductoConOpciones(id: string) {
  const producto = await prisma.producto.findUnique({
    where: { id, activo: true },
    include: {
      tramosPrecio: { orderBy: { cantidadDesde: "asc" } },
      opciones: {
        orderBy: { orden: "asc" },
        include: { opcion: { include: { valores: { where: { activo: true } } } } },
      },
    },
  });

  if (!producto) return null;

  return {
    id: producto.id,
    nombre: producto.nombre,
    categoria: producto.categoria,
    descripcion: producto.descripcion,
    imagenesUrl: producto.imagenesUrl,
    tipoCalculo: producto.tipoCalculo,
    precioBase: Number(producto.precioBase),
    cantidadMinima: producto.cantidadMinima,
    tramosPrecio: producto.tramosPrecio.map((t) => ({
      cantidadDesde: t.cantidadDesde,
      cantidadHasta: t.cantidadHasta,
      precioUnitario: Number(t.precioUnitario),
    })),
    grupos: producto.opciones.map((po) => ({
      opcionId: po.opcion.id,
      nombre: po.opcion.nombre,
      requerida: po.requerida,
      dependeDeValorOpcionId: po.dependeDeValorOpcionId,
      valores: po.opcion.valores.map((v) => ({
        id: v.id,
        nombre: v.nombre,
        tipoModificador: v.tipoModificador,
        valorModificador: Number(v.valorModificador),
      })),
    })),
  };
}

export type ProductoCatalogo = Awaited<ReturnType<typeof obtenerProductosActivos>>[number];
export type ProductoDetalle = NonNullable<Awaited<ReturnType<typeof obtenerProductoConOpciones>>>;
