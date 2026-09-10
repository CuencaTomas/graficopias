"use client";

import { useState } from "react";
import Link from "next/link";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/#catalogo", texto: "Productos" },
  { href: "/contacto", texto: "Contacto" },
];

export function MenuMobile() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        className="flex h-9 w-9 items-center justify-center text-blanco"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          {abierto ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {abierto && (
        <nav className="absolute inset-x-0 top-full flex flex-col border-b-4 border-rojo bg-negro px-4 py-2 text-blanco">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setAbierto(false)}
              className="border-b border-white/10 py-3 text-sm font-medium last:border-none hover:text-rojo"
            >
              {enlace.texto}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
