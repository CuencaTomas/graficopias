type SemicirculoProps = {
  radio: number;
  grosor: number;
};

/**
 * Semicírculo (anillo abierto) centrado en (50,50), con la mitad dibujada
 * a la izquierda y abierto hacia la derecha — ver docs/resumen-proyecto-graficopias.md.
 */
function Semicirculo({ radio, grosor }: SemicirculoProps) {
  const circunferencia = 2 * Math.PI * radio;
  const mitad = circunferencia / 2;

  return (
    <circle
      cx="50"
      cy="50"
      r={radio}
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeDasharray={`${mitad} ${mitad}`}
      strokeDashoffset={mitad / 2}
    />
  );
}

export function Isotipo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      <Semicirculo radio={24} grosor={10} />
      <Semicirculo radio={42} grosor={11} />
    </svg>
  );
}
