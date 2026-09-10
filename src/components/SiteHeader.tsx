import Link from "next/link";
import { Isotipo } from "./Isotipo";
import { MenuMobile } from "./MenuMobile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-rojo bg-negro">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-blanco">
          <span className="text-lg font-bold tracking-wide">GRAFICOPIAS</span>
          <Isotipo className="h-9 w-9 text-rojo" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-blanco sm:flex">
          <Link href="/" className="hover:text-rojo">
            Inicio
          </Link>
          <Link href="/#catalogo" className="hover:text-rojo">
            Productos
          </Link>
          <Link href="/contacto" className="hover:text-rojo">
            Contacto
          </Link>
        </nav>
        <MenuMobile />
      </div>
    </header>
  );
}
