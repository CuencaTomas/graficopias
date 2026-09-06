"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EstadoPedido } from "@prisma/client";

export function AvanzarButton({ pedidoId, estado }: { pedidoId: string; estado: EstadoPedido }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const esUltimoPaso = estado === "TERMINADO";

  async function avanzar() {
    setCargando(true);
    try {
      const respuesta = await fetch(`/api/admin/pedidos/${pedidoId}/avanzar`, { method: "POST" });
      if (!respuesta.ok) throw new Error();
      router.refresh();
    } finally {
      setCargando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={avanzar}
      disabled={cargando}
      className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50 ${
        esUltimoPaso
          ? "bg-rojo text-blanco hover:brightness-110"
          : "border border-black/15 text-black/70 hover:border-rojo hover:text-rojo"
      }`}
    >
      {cargando ? "…" : esUltimoPaso ? "Entregar" : "Avanzar →"}
    </button>
  );
}
