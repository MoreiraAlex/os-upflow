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
      select: { workshopId: true },
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

    delete params.page
    delete params.pageSize
    delete params.limit
    delete params.search
    delete params.sort

    const filters = []
    filters.push({
      workshopId: user.workshopId,
    })

    if (search) {
      const parsedNumber = Number(search)
      const isNumberSearch = !isNaN(parsedNumber)

      const orFilters = [
        { status: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { vehicle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]

      if (isNumberSearch) {
        orFilters.push({
          number: parsedNumber,
        })
      }

      filters.push({
        OR: orFilters,
      })
    }

    const filterConfig = {
      number: 'number',
      status: 'string',
    }

    Object.entries(params).forEach(([field, value]) => {
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
            equals: value,
          },
        })
      }
    })

    const where = filters.length ? { AND: filters } : {}

    const [sortField, sortOrder] = sortParam.split(':')
    const sortMap = {
      number: { number: sortOrder },
      status: { status: sortOrder },
      client: { client: sortOrder },
      vehicle: { vehicle: sortOrder },
      description: { description: sortOrder },
      createdAt: { createdAt: sortOrder },
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
    const { client, vehicle, description, status } = body

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
        status: status || '1',
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
