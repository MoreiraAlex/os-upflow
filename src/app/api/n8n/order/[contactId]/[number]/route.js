import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization')
    const sessionBearer = await auth.api.getSession({
      headers: {
        authorization: authHeader,
      },
    })

    if (!sessionBearer?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contactId, number } = await params
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { workshopId: true },
    })

    if (!contact?.workshopId) {
      return NextResponse.json(
        { error: 'Contact has no workshop' },
        { status: 400 },
      )
    }

    const body = await req.json()
    const { status, client, vehicle, description } = body

    if (!status && !client && !vehicle && !description) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 },
      )
    }

    const existingOrder = await prisma.serviceOrder.findFirst({
      where: {
        number: parseInt(number),
        workshopId: contact.workshopId,
      },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Service order not found' },
        { status: 404 },
      )
    }

    const updatedOrder = await prisma.serviceOrder.update({
      where: {
        workshopId_number: {
          workshopId: contact.workshopId,
          number: parseInt(number),
        },
      },
      data: {
        ...(status !== undefined && { status: String(status) }),
        ...(client !== undefined && { client: String(client) }),
        ...(vehicle !== undefined && { vehicle: String(vehicle) }),
        ...(description !== undefined && { description: String(description) }),
      },
    })

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error('UPDATE_SERVICE_ORDER_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
