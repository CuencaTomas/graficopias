"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calcularSubtotal } from "@/lib/pricing";
import { formatearPrecio } from "@/lib/format";
import type { ProductoDetalle } from "@/lib/catalogo";
import { CarruselImagenes } from "@/components/CarruselImagenes";

function etiquetaModificador(tipo: "PORCENTAJE" | "FIJO", valor: number): string {
  if (valor === 0) return "Sin cargo";
  if (tipo === "PORCENTAJE") return `+${valor}%`;
  return `+${formatearPrecio(valor)}`;
}

export function ProductoConfigurador({ producto }: { producto: ProductoDetalle }) {
  const router = useRouter();
  const esM2 = producto.tipoCalculo === "M2";

  const [cantidad, setCantidad] = useState(producto.cantidadMinima ?? 1);
  const [ancho, setAncho] = useState(1);
  const [alto, setAlto] = useState(1);
  const [seleccion, setSeleccion] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    for (const grupo of producto.grupos) {
      if (grupo.valores.length > 0) inicial[grupo.opcionId] = grupo.valores[0].id;
    }
    return inicial;
  });
  const [quiereDiseno, setQuiereDiseno] = useState(false);
  const [comentario, setComentario] = useState("");

  const areaCalculada = Math.round(ancho * alto * 100) / 100;
  const cantidadEfectiva = esM2
    ? Math.max(producto.cantidadMinima ?? 0, areaCalculada)
    : cantidad;

  const valoresSeleccionadosIds = useMemo(() => new Set(Object.values(seleccion)), [seleccion]);

  // Un grupo sólo es visible si no depende de nada, o si el valor del que
  // depende está efectivamente elegido en otro grupo (árbol de opciones).
  const gruposVisibles = useMemo(
    () =>
      producto.grupos.filter(
        (grupo) => !grupo.dependeDeValorOpcionId || valoresSeleccionadosIds.has(grupo.dependeDeValorOpcionId)
      ),
    [producto.grupos, valoresSeleccionadosIds]
  );

  const opcionesSeleccionadas = useMemo(() => {
    return gruposVisibles
      .map((grupo) => {
        const valorId = seleccion[grupo.opcionId];
        const valor = grupo.valores.find((v) => v.id === valorId);
        if (!valor) return null;
        return {
          valorOpcionId: valor.id,
          tipoModificador: valor.tipoModificador,
          valorModificador: valor.valorModificador,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
  }, [seleccion, gruposVisibles]);

  const total = calcularSubtotal(
    { tipoCalculo: producto.tipoCalculo, precioBase: producto.precioBase, tramosPrecio: producto.tramosPrecio },
    cantidadEfectiva,
    opcionesSeleccionadas
  );

  const minimo = producto.cantidadMinima ?? 1;

  function continuar() {
    const resumen = {
      productoId: producto.id,
      nombre: producto.nombre,
      tipoCalculo: producto.tipoCalculo,
      cantidad: cantidadEfectiva,
      ancho: esM2 ? ancho : null,
      alto: esM2 ? alto : null,
      opciones: gruposVisibles.map((grupo) => {
        const valorId = seleccion[grupo.opcionId];
        const valor = grupo.valores.find((v) => v.id === valorId);
        return { grupo: grupo.nombre, valorOpcionId: valorId, valorNombre: valor?.nombre ?? "" };
      }),
      quiereDiseno,
      comentario,
      total,
    };
    sessionStorage.setItem("graficopias:pedido-en-curso", JSON.stringify(resumen));
    router.push("/pedido/confirmar");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 sm:pb-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <CarruselImagenes
          tipoCalculo={producto.tipoCalculo}
          imagenesUrl={producto.imagenesUrl}
          className="h-64 w-full sm:h-80"
        />

        <div>
          <h1 className="text-2xl font-bold text-negro">{producto.nombre}</h1>
          {producto.descripcion && <p className="mt-1 text-black/60">{producto.descripcion}</p>}
          {producto.cantidadMinima && (
            <p className="mt-1 text-sm text-black/50">
              Mínimo {producto.cantidadMinima} {esM2 ? "m²" : "unidades"}
            </p>
          )}

          {esM2 ? (
            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-negro">Medidas (metros)</h2>
              <div className="flex gap-3">
                <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-black/60">
                  Ancho
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={ancho}
                    onChange={(e) => setAncho(Math.max(0.1, Number(e.target.value)))}
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3 py-2 focus:border-rojo focus:outline-none"
                  />
                </label>
                <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-black/60">
                  Alto
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={alto}
                    onChange={(e) => setAlto(Math.max(0.1, Number(e.target.value)))}
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3 py-2 focus:border-rojo focus:outline-none"
                  />
                </label>
              </div>
              <p className="mt-1 text-sm text-black/50">{cantidadEfectiva} m²</p>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-negro">Cantidad</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(minimo, c - 1))}
                  className="h-10 w-10 rounded-lg border border-black/15 text-lg font-semibold hover:border-rojo"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => c + 1)}
                  className="h-10 w-10 rounded-lg border border-black/15 text-lg font-semibold hover:border-rojo"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {gruposVisibles.map((grupo) => (
            <div key={grupo.opcionId} className="mt-6">
              <h2 className="mb-2 font-semibold text-negro">{grupo.nombre}</h2>
              <div className="flex flex-col gap-2">
                {grupo.valores.map((valor) => {
                  const activo = seleccion[grupo.opcionId] === valor.id;
                  return (
                    <button
                      type="button"
                      key={valor.id}
                      onClick={() => setSeleccion((s) => ({ ...s, [grupo.opcionId]: valor.id }))}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                        activo
                          ? "border-rojo bg-rojo/5 text-rojo"
                          : "border-black/15 text-black/70 hover:border-rojo/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full border-2 ${
                            activo ? "border-rojo bg-rojo" : "border-black/30"
                          }`}
                        />
                        {valor.nombre}
                      </span>
                      <span className={activo ? "text-rojo" : "text-black/50"}>
                        {etiquetaModificador(valor.tipoModificador, valor.valorModificador)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-negro">
              <input
                type="checkbox"
                checked={quiereDiseno}
                onChange={(e) => setQuiereDiseno(e.target.checked)}
                className="h-4 w-4 accent-rojo"
              />
              Quiero que me lo diseñen
            </label>
            {quiereDiseno && (
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Contanos qué necesitás para el diseño"
                rows={3}
                className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-rojo focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-black/10 bg-blanco px-4 py-4 sm:static sm:mt-8 sm:border-none sm:px-0 sm:py-0">
        <div>
          <p className="text-xs text-black/50">Total</p>
          <p className="text-xl font-bold text-negro">{formatearPrecio(total)}</p>
        </div>
        <button
          type="button"
          onClick={continuar}
          disabled={total <= 0}
          className="rounded-lg bg-rojo px-8 py-3 font-semibold text-blanco transition hover:brightness-110 disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
