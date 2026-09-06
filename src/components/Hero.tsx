export function Hero() {
  return (
    <section className="relative overflow-hidden bg-negro">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[140%] w-2/3 rotate-12 bg-rojo"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h1 className="max-w-md text-3xl font-bold text-blanco sm:text-4xl">
          Gráfica digital y gran formato
        </h1>
        <p className="mt-3 max-w-sm text-white/70 sm:text-lg">
          Presupuestá tu impresión al instante, sin pisar el local.
        </p>
        <a
          href="#catalogo"
          className="mt-6 inline-block rounded-lg bg-rojo px-6 py-3 font-semibold text-blanco transition hover:brightness-110"
        >
          Ver catálogo
        </a>
      </div>
    </section>
  );
}
