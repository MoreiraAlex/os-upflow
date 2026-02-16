import { ServiceOrdersTable } from '@/components/tables/order/table'

export default function Order() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Ordens de Serviço</h1>

      <ServiceOrdersTable />
    </div>
  )
}
