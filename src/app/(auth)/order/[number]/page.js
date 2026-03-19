import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ServiceOrderDetailPage({ params }) {
  const incomingHeaders = headers()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/${params.number}`,
    {
      headers: {
        cookie: incomingHeaders.get('cookie') ?? '',
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) return notFound()
  const order = await res.json()

  const STATUS_LABEL = {
    1: 'Aberta',
    2: 'Em andamento',
    3: 'Concluída',
    4: 'Cancelada',
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordem #{order.number}</h1>
          <p className="text-sm text-muted-foreground">
            Criada em {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 md:flex-row-reverse">
          <Link href="/order">
            <Button variant="outline">← Voltar</Button>
          </Link>
          <Badge variant="secondary">
            {STATUS_LABEL[order.status] ?? 'Desconhecido'}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Informações do Cliente
          </h2>

          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="font-medium">{order.clientName || 'Não informado'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">CPF</p>
            <p className="font-medium">{order.clientCPF || 'Não informado'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-medium">
              {order.clientPhone || 'Não informado'}
            </p>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Veículo</h2>

          <div>
            <p className="text-sm text-muted-foreground">Modelo</p>
            <p className="font-medium">
              {order.vehicleBrand} {order.vehicleModel} ({order.vehicleYear})
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Placa</p>
            <p className="font-medium">
              {order.vehiclePlate || 'Não informado'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Detalhes</p>
            <p className="font-medium">
              {order.vehicleType} • {order.vehicleEngine}
            </p>
          </div>
        </Card>

        <Card className="p-5 space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold border-b pb-2">
            Detalhes do Serviço
          </h2>

          <div>
            <p className="text-sm text-muted-foreground">Descrição</p>
            <p className="font-medium whitespace-pre-line">
              {order.description}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Última atualização</p>
            <p className="font-medium">
              {new Date(order.updatedAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
