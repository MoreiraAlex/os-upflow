import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = randomUUID()

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
