import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workshopId: true, role: true },
    })

    if (!user?.workshopId) {
      return NextResponse.json(
        { error: 'User has no workshop' },
        { status: 400 },
      )
    }

    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams.entries())

    const page = Number(params.page) || 1
    const pageSize = Number(params.limit || params.pageSize) || 8
    const search = params.search || ''
    const sortParam = params.sort || 'createdAt:desc'

    const filters = []
    filters.push({
      workshopId: user.workshopId,
    })

    if (search) {
      // ToDo: Filtrar por data
      const parsedNumber = Number(search)
      const isNumberSearch = !isNaN(parsedNumber)

      const orFilters = [
        { status: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientCPF: { contains: search } },
        { clientPhone: { contains: search } },
        { vehicleModel: { contains: search, mode: 'insensitive' } },
        { vehicleBrand: { contains: search, mode: 'insensitive' } },
        { vehiclePlate: { contains: search, mode: 'insensitive' } },
        { vehicleType: { contains: search, mode: 'insensitive' } },
        { vehicleEngine: { contains: search, mode: 'insensitive' } },
      ]

      if (isNumberSearch) {
        orFilters.push({ number: parsedNumber }, { vehicleYear: parsedNumber })
      }

      filters.push({
        OR: orFilters,
      })
    }

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

    const data = await prisma.serviceOrder.findMany({
      where,
      orderBy: sortMap[sortField] ?? { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const total = await prisma.serviceOrder.count({ where })
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json(
      {
        data,
        user,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
      },
      { status: 200 },
    )
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
      where: { workshopId: user.workshopId },
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
