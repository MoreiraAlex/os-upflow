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
    const {
      status,
      description,
      clientName,
      clientCPF,
      clientPhone,
      vehicleModel,
      vehicleBrand,
      vehicleYear,
      vehiclePlate,
      vehicleType,
      vehicleEngine,
    } = body

    if (
      !status &&
      !description &&
      !clientName &&
      !clientCPF &&
      !clientPhone &&
      !vehicleModel &&
      !vehicleBrand &&
      !vehicleYear &&
      !vehiclePlate &&
      !vehicleType &&
      !vehicleEngine
    ) {
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
        ...(description !== undefined && { description: String(description) }),
        ...(clientName !== undefined && { clientName: String(clientName) }),
        ...(clientCPF !== undefined && { clientCPF: String(clientCPF) }),
        ...(clientPhone !== undefined && { clientPhone: String(clientPhone) }),
        ...(vehicleModel !== undefined && {
          vehicleModel: String(vehicleModel),
        }),
        ...(vehicleBrand !== undefined && {
          vehicleBrand: String(vehicleBrand),
        }),
        ...(vehicleYear !== undefined && { vehicleYear: Number(vehicleYear) }),
        ...(vehiclePlate !== undefined && {
          vehiclePlate: String(vehiclePlate),
        }),
        ...(vehicleType !== undefined && { vehicleType: String(vehicleType) }),
        ...(vehicleEngine !== undefined && {
          vehicleEngine: String(vehicleEngine),
        }),
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
