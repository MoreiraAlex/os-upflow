import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req, { params }) {
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

    const { contactId } = await params
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

    const url = new URL(req.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    const sortParam = searchParams.sort || 'createdAt:desc'

    const filters = []
    filters.push({
      workshopId: contact.workshopId,
    })

    const filterConfig = {
      number: 'number',
      status: 'string',
      description: 'string',
      createdAt: 'string',
      clientName: 'string',
      clientCPF: 'string',
      clientPhone: 'string',
      vehicleModel: 'string',
      vehicleBrand: 'string',
      vehicleYear: 'number',
      vehiclePlate: 'string',
      vehicleType: 'string',
      vehicleEngine: 'string',
    }

    Object.entries(searchParams).forEach(([field, value]) => {
      if (!value) return
      if (!filterConfig[field]) return

      if (filterConfig[field] === 'number') {
        const parsed = Number(value)
        if (!isNaN(parsed)) {
          filters.push({ [field]: parsed })
        }
      }

      if (filterConfig[field] === 'string') {
        filters.push({
          [field]: {
            contains: value,
            mode: 'insensitive',
          },
        })
      }
    })

    const where = filters.length ? { AND: filters } : {}

    const [sortField, sortOrder] = sortParam.split(':')
    const sortMap = {
      number: { number: sortOrder },
      status: { status: sortOrder },
      description: { description: sortOrder },
      createdAt: { createdAt: sortOrder },
      clientName: { clientName: sortOrder },
      clientCPF: { clientCPF: sortOrder },
      clientPhone: { clientPhone: sortOrder },
      vehicleModel: { vehicleModel: sortOrder },
      vehicleBrand: { vehicleBrand: sortOrder },
      vehicleYear: { vehicleYear: sortOrder },
      vehiclePlate: { vehiclePlate: sortOrder },
      vehicleType: { vehicleType: sortOrder },
      vehicleEngine: { vehicleEngine: sortOrder },
    }

    const orders = await prisma.serviceOrder.findMany({
      where,
      orderBy: sortMap[sortField] ?? { createdAt: 'desc' },
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('LIST_SERVICE_ORDERS_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(req, { params }) {
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

    const { contactId } = await params
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
      !description ||
      !clientName ||
      !clientCPF ||
      !clientPhone ||
      !vehicleModel ||
      !vehicleBrand ||
      !vehicleYear ||
      !vehiclePlate ||
      !vehicleType ||
      !vehicleEngine
    ) {
      return NextResponse.json(
        { error: 'required fields missing' },
        { status: 400 },
      )
    }

    const lastOrder = await prisma.serviceOrder.findFirst({
      where: { workshopId: contact.workshopId },
      orderBy: { number: 'desc' },
      select: { number: true },
    })

    const nextNumber = lastOrder ? lastOrder.number + 1 : 1
    const serviceOrder = await prisma.serviceOrder.create({
      data: {
        number: nextNumber,
        status: status || '1',
        description,
        clientName,
        clientCPF,
        clientPhone,
        vehicleModel,
        vehicleBrand,
        vehicleYear: Number(vehicleYear),
        vehiclePlate,
        vehicleType,
        vehicleEngine,
        workshopId: contact.workshopId,
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
