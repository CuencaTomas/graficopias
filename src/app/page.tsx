import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { CatalogoGrid } from "@/components/CatalogoGrid";
import { BotonWhatsapp } from "@/components/BotonWhatsapp";
import { obtenerProductosActivos } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const productos = await obtenerProductosActivos();

  return (
    <div className="flex min-h-full flex-col bg-blanco">
      <SiteHeader />
      <Hero />
      <CatalogoGrid productos={productos} />
      <BotonWhatsapp />
    </div>
  );
}
