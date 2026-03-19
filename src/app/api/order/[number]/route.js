import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
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

    const { number } = await params
    const serviceOrder = await prisma.serviceOrder.findFirst({
      where: {
        number: parseInt(number),
        workshopId: user.workshopId,
      },
    })

    if (!serviceOrder) {
      return NextResponse.json(
        { error: 'Service order not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(serviceOrder, { status: 200 })
  } catch (error) {
    console.error('GET_SERVICE_ORDER_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(req, { params }) {
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

    const { number } = await params
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
        workshopId: user.workshopId,
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
          workshopId: user.workshopId,
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

export async function DELETE(req, { params }) {
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

    const { number } = await params
    const existingOrder = await prisma.serviceOrder.findFirst({
      where: {
        number: parseInt(number),
        workshopId: user.workshopId,
      },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Service order not found' },
        { status: 404 },
      )
    }

    await prisma.serviceOrder.delete({
      where: {
        workshopId_number: {
          workshopId: user.workshopId,
          number: parseInt(number),
        },
      },
    })

    return NextResponse.json({ status: 204 })
  } catch (error) {
    console.error('DELETE_SERVICE_ORDER_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
