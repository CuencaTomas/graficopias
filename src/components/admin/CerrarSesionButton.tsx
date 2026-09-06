"use client";

import { signOut } from "next-auth/react";

export function CerrarSesionButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm font-medium text-white/60 hover:text-blanco"
    >
      Cerrar sesión
    </button>
  );
}
