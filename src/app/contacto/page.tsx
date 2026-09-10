import Link from "next/link";
import { Isotipo } from "@/components/Isotipo";

const ENLACES = [
  {
    nombre: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=5491126695842&text&type=phone_number&app_absent=0",
    color: "bg-[#25D366] hover:bg-[#1fb959]",
    icono: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.657 4.464 1.795 6.293L4 29l7.9-1.746A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.687 1.036 1.02-4.567-.232-.373A9.71 9.71 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.75 9.07 26.75 15 21.933 24.75 16.004 24.75Zm5.54-7.32c-.303-.152-1.793-.885-2.07-.986-.278-.101-.48-.152-.682.152-.202.303-.783.985-.96 1.187-.177.202-.353.227-.656.076-.303-.152-1.28-.472-2.438-1.507-.901-.804-1.51-1.797-1.687-2.1-.177-.303-.019-.467.133-.618.136-.136.303-.353.454-.53.152-.177.202-.303.303-.505.101-.202.05-.379-.025-.53-.076-.152-.682-1.646-.935-2.253-.246-.591-.497-.511-.682-.52l-.581-.01c-.202 0-.53.076-.807.379-.278.303-1.06 1.036-1.06 2.527s1.086 2.933 1.238 3.135c.152.202 2.138 3.264 5.182 4.577.724.313 1.288.5 1.729.64.727.231 1.389.198 1.912.12.583-.087 1.793-.733 2.046-1.44.253-.708.253-1.314.177-1.44-.076-.126-.278-.202-.581-.354Z" />
      </svg>
    ),
  },
  {
    nombre: "Instagram",
    href: "https://www.instagram.com/graficopias10/",
    color: "bg-[#E4405F] hover:bg-[#cc3752]",
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    nombre: "Facebook",
    href: "https://www.facebook.com/Graficopias",
    color: "bg-[#1877F2] hover:bg-[#1465d1]",
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    nombre: "Email",
    href: "mailto:graficopias10@gmail.com",
    color: "bg-white/10 hover:bg-white/20",
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
];

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-negro px-4 py-16 text-blanco">
      <Isotipo className="h-12 w-12 text-rojo" />
      <h1 className="mt-3 text-xl font-bold tracking-wide">GRAFICOPIAS</h1>
      <p className="mt-1 text-sm text-white/50">Elegí por dónde escribirnos</p>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        {ENLACES.map((enlace) => (
          <a
            key={enlace.nombre}
            href={enlace.href}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-3 rounded-xl px-5 py-4 font-semibold text-blanco shadow-sm transition ${enlace.color}`}
          >
            {enlace.icono}
            {enlace.nombre}
          </a>
        ))}
      </div>

      <Link href="/" className="mt-10 text-sm text-white/50 hover:text-white/80">
        ← Volver al catálogo
      </Link>
    </div>
  );
}
