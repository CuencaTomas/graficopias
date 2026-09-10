"use client";

import { useRef, useState } from "react";
import type { TipoCalculo } from "@prisma/client";
import { IconoPlaceholder } from "./ImagenProducto";

export function CarruselImagenes({
  imagenesUrl,
  tipoCalculo,
  className,
}: {
  imagenesUrl: string[];
  tipoCalculo: TipoCalculo;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);

  if (imagenesUrl.length === 0) {
    return <IconoPlaceholder tipoCalculo={tipoCalculo} className={className} />;
  }

  function irA(indice: number) {
    const contenedor = scrollRef.current;
    if (!contenedor) return;
    contenedor.scrollTo({ left: indice * contenedor.clientWidth, behavior: "smooth" });
    setActiva(indice);
  }

  function alScrollear() {
    const contenedor = scrollRef.current;
    if (!contenedor || contenedor.clientWidth === 0) return;
    const indice = Math.round(contenedor.scrollLeft / contenedor.clientWidth);
    setActiva(indice);
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className ?? ""}`}>
      <div
        ref={scrollRef}
        onScroll={alScrollear}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {imagenesUrl.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt=""
            className="h-full w-full flex-shrink-0 snap-start object-cover"
          />
        ))}
      </div>

      {imagenesUrl.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {imagenesUrl.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`pointer-events-auto h-2 w-2 rounded-full transition ${
                i === activa ? "bg-rojo" : "bg-blanco/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
