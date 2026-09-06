import Link from "next/link";
import { ImagenProducto } from "./ImagenProducto";
import { formatearPrecio, unidadPorTipoCalculo } from "@/lib/format";
import type { ProductoCatalogo } from "@/lib/catalogo";

export function ProductoCard({ producto }: { producto: ProductoCatalogo }) {
  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-blanco transition hover:border-rojo hover:shadow-md"
    >
      <ImagenProducto
        tipoCalculo={producto.tipoCalculo}
        imagenUrl={producto.imagenUrl}
        className="h-36 w-full"
      />
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-semibold text-negro">{producto.nombre}</h3>
        <p className="text-sm text-black/60">
          Desde {formatearPrecio(producto.precioDesde)}
          {unidadPorTipoCalculo(producto.tipoCalculo)}
        </p>
      </div>
    </Link>
  );
}
