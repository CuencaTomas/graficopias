import type { TipoCalculo } from "@prisma/client";

function IconoDocumento() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

function IconoMarco() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      <rect x="4" y="4" width="16" height="16" rx="1" />
    </svg>
  );
}

function IconoTramos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      <rect x="5" y="6" width="14" height="4" rx="0.5" />
      <rect x="5" y="12" width="14" height="4" rx="0.5" />
      <rect x="5" y="18" width="9" height="2" rx="0.5" />
    </svg>
  );
}

const ICONOS: Record<TipoCalculo, () => React.ReactElement> = {
  UNIDAD: IconoDocumento,
  M2: IconoMarco,
  ESCALONADO: IconoTramos,
};

export function IconoPlaceholder({ tipoCalculo, className }: { tipoCalculo: TipoCalculo; className?: string }) {
  const Icono = ICONOS[tipoCalculo];
  return (
    <div className={`flex items-center justify-center bg-black/5 text-black/30 ${className ?? ""}`}>
      <Icono />
    </div>
  );
}

export function ImagenProducto({
  tipoCalculo,
  imagenesUrl,
  className,
}: {
  tipoCalculo: TipoCalculo;
  imagenesUrl?: string[] | null;
  className?: string;
}) {
  const primera = imagenesUrl?.[0];

  if (primera) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={primera} alt="" className={className} />;
  }

  return <IconoPlaceholder tipoCalculo={tipoCalculo} className={className} />;
}
