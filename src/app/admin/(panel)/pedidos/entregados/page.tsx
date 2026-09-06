import { obtenerPedidosEntregados } from "@/lib/adminPedidos";
import { PedidosLista } from "@/components/admin/PedidosLista";

export default async function AdminPedidosEntregadosPage() {
  const pedidos = await obtenerPedidosEntregados();
  return <PedidosLista pedidos={pedidos} activa={false} />;
}
