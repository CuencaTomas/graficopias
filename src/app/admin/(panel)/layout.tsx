import { contarPedidos } from "@/lib/adminPedidos";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { CerrarSesionButton } from "@/components/admin/CerrarSesionButton";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { activos, entregados } = await contarPedidos();

  return (
    <div className="flex min-h-full flex-col bg-black/[.02]">
      <header className="border-b-4 border-rojo bg-negro px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-blanco">Admin · Pedidos</h1>
          <CerrarSesionButton />
        </div>
      </header>
      <div className="bg-blanco">
        <AdminTabs activos={activos} entregados={entregados} />
      </div>
      <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
