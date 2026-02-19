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
      const orFilters = [
        { phone: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]

      filters.push({
        OR: orFilters,
      })
    }

    const filterConfig = {
      phone: 'string',
      name: 'string',
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
      phone: { phone: sortOrder },
      name: { name: sortOrder },
      createdAt: { createdAt: sortOrder },
    }

    const data = await prisma.contact.findMany({
      where,
      orderBy: sortMap[sortField] ?? { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const total = await prisma.contact.count({ where })
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
    console.error('LIST_CONTACT_ERROR', error)

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
        { error: 'User has no workshop' },
        { status: 400 },
      )
    }

    const body = await req.json()

    const { phone, name } = body

    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 },
      )
    }

    const contact = await prisma.contact.create({
      data: {
        workshopId: user.workshopId,
        phone,
        name,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('CREATE_CONTACT_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao criar contato' },
      { status: 500 },
    )
  }
}
