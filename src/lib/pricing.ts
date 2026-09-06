import { TipoCalculo, TipoModificador } from "@prisma/client";

export type OpcionParaCalculo = {
  valorOpcionId: string;
  tipoModificador: TipoModificador;
  valorModificador: number;
};

export type TramoParaCalculo = {
  cantidadDesde: number;
  cantidadHasta: number | null;
  precioUnitario: number;
};

export type ProductoParaCalculo = {
  tipoCalculo: TipoCalculo;
  precioBase: number;
  tramosPrecio: TramoParaCalculo[];
};

export function precioUnitarioBase(
  producto: ProductoParaCalculo,
  cantidad: number
): number {
  if (producto.tipoCalculo === TipoCalculo.ESCALONADO) {
    const tramo = producto.tramosPrecio.find(
      (t) => cantidad >= t.cantidadDesde && (t.cantidadHasta === null || cantidad <= t.cantidadHasta)
    );
    return tramo ? tramo.precioUnitario : 0;
  }
  return producto.precioBase;
}

export function calcularSubtotal(
  producto: ProductoParaCalculo,
  cantidad: number,
  opcionesSeleccionadas: OpcionParaCalculo[]
): number {
  if (cantidad <= 0) return 0;

  const base = precioUnitarioBase(producto, cantidad);

  const totalFijo = opcionesSeleccionadas
    .filter((o) => o.tipoModificador === TipoModificador.FIJO)
    .reduce((suma, o) => suma + o.valorModificador, 0);

  const totalPorcentaje = opcionesSeleccionadas
    .filter((o) => o.tipoModificador === TipoModificador.PORCENTAJE)
    .reduce((suma, o) => suma + o.valorModificador, 0);

  const precioUnitarioEfectivo = base * (1 + totalPorcentaje / 100) + totalFijo;

  return Math.round(precioUnitarioEfectivo * cantidad * 100) / 100;
}
