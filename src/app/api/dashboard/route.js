import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { workshopId: true },
  })

  if (!user?.workshopId) {
    return NextResponse.json({ error: 'User has no workshop' }, { status: 400 })
  }

  const workshopId = user?.workshopId

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfNextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  )

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const openCount = await prisma.serviceOrder.count({
    where: { workshopId, status: '1' },
  })

  const inProgressCount = await prisma.serviceOrder.count({
    where: { workshopId, status: '2' },
  })

  const closeCount = await prisma.serviceOrder.count({
    where: {
      workshopId,
      status: '3',
      createdAt: {
        gte: startOfDay,
        lt: startOfNextDay,
      },
    },
  })

  const cancelCount = await prisma.serviceOrder.count({
    where: {
      workshopId,
      status: '4',
      createdAt: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
  })

  const totalCount = await prisma.serviceOrder.count({
    where: {
      workshopId,
      createdAt: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
  })

  const messages = await prisma.message.findMany({
    where: {
      contact: {
        workshopId,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      contact: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  })

  const orders = await prisma.serviceOrder.findMany({
    where: { workshopId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const startDate = days[0]
  const endDate = new Date(days[6])
  endDate.setHours(23, 59, 59, 999)

  const ordersLast7Days = await prisma.serviceOrder.findMany({
    where: {
      workshopId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  })

  const chartMap = new Map()

  for (const day of days) {
    const label = day.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
    chartMap.set(label, 0)
  }

  for (const order of ordersLast7Days) {
    const label = new Date(order.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })

    chartMap.set(label, (chartMap.get(label) ?? 0) + 1)
  }

  const chart = Array.from(chartMap.entries()).map(([day, total]) => ({
    day,
    total,
  }))

  return NextResponse.json({
    stats: {
      openCount,
      inProgressCount,
      closeCount,
      cancelCount,
      totalCount,
    },
    chart,
    messages,
    orders,
  })
}
