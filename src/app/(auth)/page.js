'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const stats = [
    { label: 'OS Abertas', value: 12 },
    { label: 'OS em Andamento', value: 5 },
    { label: 'OS Finalizadas (Hoje)', value: 8 },
    { label: 'Total no Mês', value: 143 },
  ]

  const recentOrders = [
    {
      number: 123,
      client: 'João Silva',
      vehicle: 'Gol 2015',
      status: 'Aberta',
      createdAt: '13/02/2026 09:42',
    },
    {
      number: 124,
      client: 'Maria Souza',
      vehicle: 'Onix 2020',
      status: 'Em andamento',
      createdAt: '13/02/2026 08:15',
    },
    {
      number: 125,
      client: 'Carlos Lima',
      vehicle: 'HB20 2018',
      status: 'Finalizada',
      createdAt: '12/02/2026 17:30',
    },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{item.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Últimas OS */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Últimas Ordens de Serviço</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="self-start sm:self-auto"
          >
            Ver todas
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.number}
                className="
                  flex flex-col gap-2
                  sm:flex-row sm:items-center sm:justify-between
                  border rounded-lg p-3
                "
              >
                <div>
                  <p className="font-medium">
                    OS #{order.number} — {order.client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.vehicle} • {order.createdAt}
                  </p>
                </div>

                <div className="flex justify-end sm:justify-start">
                  <Badge variant="outline">{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
