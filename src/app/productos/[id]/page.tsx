import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { obtenerProductoConOpciones } from "@/lib/catalogo";
import { ProductoConfigurador } from "./ProductoConfigurador";

export const dynamic = "force-dynamic";

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = await obtenerProductoConOpciones(id);

  if (!producto) notFound();

  return (
    <div className="flex min-h-full flex-col bg-blanco">
      <SiteHeader />
      <ProductoConfigurador producto={producto} />
    </div>
  );
}
