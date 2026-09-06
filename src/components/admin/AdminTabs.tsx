"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminTabs({ activos, entregados }: { activos: number; entregados: number }) {
  const pathname = usePathname();
  const enEntregados = pathname.startsWith("/admin/pedidos/entregados");

  return (
    <div className="flex gap-6 border-b border-black/10 px-4 sm:px-6">
      <Link
        href="/admin/pedidos"
        className={`border-b-2 py-3 text-sm font-medium ${
          !enEntregados ? "border-rojo text-rojo" : "border-transparent text-black/50 hover:text-black/70"
        }`}
      >
        Activos ({activos})
      </Link>
      <Link
        href="/admin/pedidos/entregados"
        className={`border-b-2 py-3 text-sm font-medium ${
          enEntregados ? "border-rojo text-rojo" : "border-transparent text-black/50 hover:text-black/70"
        }`}
      >
        Entregados ({entregados})
      </Link>
    </div>
  );
}
