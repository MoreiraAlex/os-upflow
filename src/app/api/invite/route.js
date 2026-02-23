import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
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
    select: { role: true },
  })

  if (user?.role !== 'su') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json(invites)
}

export async function POST(req) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { suffix } = body

  const cleanSuffix = suffix
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 30)

  const baseToken = randomUUID()
  const token = `${baseToken}-${cleanSuffix}`

  await prisma.invite.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  })

  return NextResponse.json({
    link: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/${token}`,
  })
}
