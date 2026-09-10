"use client";

import { useEffect } from "react";

export function LightboxImagen({
  imagenesUrl,
  indice,
  onCerrar,
  onCambiar,
}: {
  imagenesUrl: string[];
  indice: number;
  onCerrar: () => void;
  onCambiar: (indice: number) => void;
}) {
  const hayVarias = imagenesUrl.length > 1;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function alTeclado(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight" && hayVarias) onCambiar((indice + 1) % imagenesUrl.length);
      if (e.key === "ArrowLeft" && hayVarias) onCambiar((indice - 1 + imagenesUrl.length) % imagenesUrl.length);
    }
    window.addEventListener("keydown", alTeclado);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", alTeclado);
    };
  }, [indice, hayVarias, imagenesUrl.length, onCerrar, onCambiar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onCerrar}
    >
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="absolute right-4 top-4 text-3xl leading-none text-white/80 hover:text-white"
      >
        ×
      </button>

      {hayVarias && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCambiar((indice - 1 + imagenesUrl.length) % imagenesUrl.length);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-3xl text-white/70 hover:text-white sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCambiar((indice + 1) % imagenesUrl.length);
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-3xl text-white/70 hover:text-white sm:right-6"
          >
            ›
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenesUrl[indice]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  );
}
