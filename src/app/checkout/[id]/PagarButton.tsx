"use client";

import { useState } from "react";
import { formatearPrecio } from "@/lib/format";

export function PagarButton({ pedidoId, monto }: { pedidoId: string; monto: number }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pagar() {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? "No se pudo iniciar el pago");
      window.location.href = datos.initPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setCargando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pagar}
        disabled={cargando}
        className="w-full rounded-lg bg-rojo px-6 py-3 font-semibold text-blanco transition hover:brightness-110 disabled:opacity-50"
      >
        {cargando ? "Redirigiendo a Mercado Pago…" : `Pagar ${formatearPrecio(monto)} con Mercado Pago`}
      </button>
      {error && <p className="mt-2 text-sm text-rojo">{error}</p>}
    </div>
  );
}
