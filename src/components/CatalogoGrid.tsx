"use client";

import { useMemo, useState } from "react";
import { ProductoCard } from "./ProductoCard";
import type { ProductoCatalogo } from "@/lib/catalogo";

export function CatalogoGrid({ productos }: { productos: ProductoCatalogo[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string>("Todos");

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria).filter((c): c is string => !!c));
    return ["Todos", ...Array.from(set)];
  }, [productos]);

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoria === "Todos" || p.categoria === categoria;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div id="catalogo" className="mx-auto w-full max-w-6xl px-4 py-8">
      <input
        type="search"
        placeholder="Buscar productos"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 w-full rounded-lg border border-black/15 px-4 py-3 text-sm focus:border-rojo focus:outline-none"
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              categoria === c
                ? "border-rojo bg-rojo text-blanco"
                : "border-black/15 bg-blanco text-black/70 hover:border-rojo"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="py-12 text-center text-black/50">No encontramos productos con ese criterio.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
