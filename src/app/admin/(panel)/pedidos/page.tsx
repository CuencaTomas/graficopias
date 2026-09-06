import { obtenerPedidosActivos } from "@/lib/adminPedidos";
import { PedidosLista } from "@/components/admin/PedidosLista";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const pedidos = await obtenerPedidosActivos();
  return <PedidosLista pedidos={pedidos} activa />;
}
