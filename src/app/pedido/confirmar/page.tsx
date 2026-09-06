"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { formatearPrecio } from "@/lib/format";
import { SENA_PORCENTAJE } from "@/lib/sena";

type ResumenPedido = {
  productoId: string;
  nombre: string;
  cantidad: number;
  opciones: { grupo: string; valorOpcionId: string; valorNombre: string }[];
  quiereDiseno: boolean;
  comentario: string;
  total: number;
};

const CLAVE_SESSION_STORAGE = "graficopias:pedido-en-curso";

function suscribirseNoOp() {
  return () => {};
}

function usePedidoEnCurso(): ResumenPedido | null {
  const guardado = useSyncExternalStore(
    suscribirseNoOp,
    () => sessionStorage.getItem(CLAVE_SESSION_STORAGE),
    () => null
  );
  return guardado ? (JSON.parse(guardado) as ResumenPedido) : null;
}

export default function ConfirmarPedidoPage() {
  const router = useRouter();
  const resumen = usePedidoEnCurso();
  const [nombreCliente, setNombreCliente] = useState("");
  const [medioContacto, setMedioContacto] = useState<"TELEFONO" | "EMAIL">("TELEFONO");
  const [contacto, setContacto] = useState("");
  const [esPagoTotal, setEsPagoTotal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!resumen) {
    return (
      <div className="flex min-h-full flex-col bg-blanco">
        <SiteHeader />
        <div className="mx-auto w-full max-w-lg px-4 py-10">
          <p className="text-black/60">
            No encontramos ningún pedido en curso.{" "}
            <Link href="/" className="text-rojo underline">
              Volver al catálogo
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const montoSena = Math.round(resumen.total * SENA_PORCENTAJE * 100) / 100;
  const montoAPagarAhora = esPagoTotal ? resumen.total : montoSena;

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (!resumen) return;
    setEnviando(true);
    setError(null);

    try {
      const respuesta = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId: resumen.productoId,
          cantidad: resumen.cantidad,
          valorOpcionIds: resumen.opciones.map((o) => o.valorOpcionId).filter(Boolean),
          quiereDiseno: resumen.quiereDiseno,
          comentario: resumen.comentario || undefined,
          nombreCliente,
          medioContacto,
          contacto,
          esPagoTotal,
        }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? "No se pudo crear el pedido");

      sessionStorage.removeItem("graficopias:pedido-en-curso");
      router.push(`/checkout/${datos.pedidoId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el pedido");
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-blanco">
      <SiteHeader />
      <div className="mx-auto w-full max-w-lg px-4 py-10">
        <h1 className="text-2xl font-bold text-negro">Confirmá tu pedido</h1>

        <div className="mt-6 rounded-xl border border-black/10 p-5">
          <h2 className="font-semibold text-negro">{resumen.nombre}</h2>
          <p className="text-sm text-black/60">Cantidad: {resumen.cantidad}</p>
          <ul className="mt-2 space-y-1 text-sm text-black/60">
            {resumen.opciones.map((o) => (
              <li key={o.grupo}>
                {o.grupo}: {o.valorNombre}
              </li>
            ))}
          </ul>
          {resumen.quiereDiseno && (
            <p className="mt-2 text-sm text-black/60">Diseño: {resumen.comentario || "(sin notas)"}</p>
          )}
          <p className="mt-3 text-lg font-bold text-negro">Total: {formatearPrecio(resumen.total)}</p>
        </div>

        <form onSubmit={confirmar} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-negro">
            Nombre
            <input
              required
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-2 text-base focus:border-rojo focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-1 text-sm font-medium text-negro">Te contactamos por</p>
            <div className="flex gap-2">
              {(["TELEFONO", "EMAIL"] as const).map((opcion) => (
                <button
                  type="button"
                  key={opcion}
                  onClick={() => setMedioContacto(opcion)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    medioContacto === opcion
                      ? "border-rojo bg-rojo/5 text-rojo"
                      : "border-black/15 text-black/70"
                  }`}
                >
                  {opcion === "TELEFONO" ? "Teléfono" : "Email"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-negro">
            {medioContacto === "TELEFONO" ? "Teléfono" : "Email"}
            <input
              required
              type={medioContacto === "EMAIL" ? "email" : "tel"}
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-2 text-base focus:border-rojo focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-1 text-sm font-medium text-negro">¿Cuánto pagás ahora?</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setEsPagoTotal(false)}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                  !esPagoTotal ? "border-rojo bg-rojo/5 text-rojo" : "border-black/15 text-black/70"
                }`}
              >
                <span>Seña ({Math.round(SENA_PORCENTAJE * 100)}%)</span>
                <span>{formatearPrecio(montoSena)}</span>
              </button>
              <button
                type="button"
                onClick={() => setEsPagoTotal(true)}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                  esPagoTotal ? "border-rojo bg-rojo/5 text-rojo" : "border-black/15 text-black/70"
                }`}
              >
                <span>Total</span>
                <span>{formatearPrecio(resumen.total)}</span>
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rojo">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-lg bg-rojo px-6 py-3 font-semibold text-blanco transition hover:brightness-110 disabled:opacity-50"
          >
            {enviando ? "Confirmando…" : `Continuar a pagar ${formatearPrecio(montoAPagarAhora)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
