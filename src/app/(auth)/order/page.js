import { ServiceOrdersTable } from '@/components/tables/order/table'

export default function Order() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Ordens de Serviço</h1>

      <ServiceOrdersTable />
    </div>
  )
}
