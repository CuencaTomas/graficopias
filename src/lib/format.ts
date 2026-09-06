const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor: number): string {
  return formatoMoneda.format(valor);
}

export function unidadPorTipoCalculo(tipoCalculo: "UNIDAD" | "M2" | "ESCALONADO"): string {
  if (tipoCalculo === "M2") return "/m²";
  return "";
}

export function idCorto(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatearFecha(fecha: Date): string {
  return formatoFecha.format(fecha);
}
