import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token } = await params
    const invite = await prisma.invite.findUnique({
      where: { token },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 },
      )
    }

    return NextResponse.json(invite)
  } catch (error) {
    console.error('GET_INVITE_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao buscar convite' },
      { status: 500 },
    )
  }
}
