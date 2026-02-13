import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET() {
  try {
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
      return NextResponse.json(
        { error: 'User has no workshop' },
        { status: 400 },
      )
    }

    const serviceOrders = await prisma.serviceOrder.findMany({
      where: { workshopId: user.workshopId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(serviceOrders, { status: 200 })
  } catch (error) {
    console.error('LIST_SERVICE_ORDERS_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(req) {
  try {
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
      return NextResponse.json(
        { error: 'User is not associated with a workshop' },
        { status: 400 },
      )
    }

    const body = await req.json()
    const { client, vehicle, description } = body

    if (!vehicle || !description) {
      return NextResponse.json(
        { error: 'Vehicle and description are required' },
        { status: 400 },
      )
    }

    const lastOrder = await prisma.serviceOrder.findFirst({
      where: { workshopId: user.workshopId },
      orderBy: { number: 'desc' },
      select: { number: true },
    })

    const nextNumber = lastOrder ? lastOrder.number + 1 : 1
    const serviceOrder = await prisma.serviceOrder.create({
      data: {
        number: nextNumber,
        status: 'Aberta',
        client,
        vehicle,
        description,
        workshopId: user.workshopId,
      },
    })

    return NextResponse.json(serviceOrder, { status: 201 })
  } catch (error) {
    console.error('CREATE_SERVICE_ORDER_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
