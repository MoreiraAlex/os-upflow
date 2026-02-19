import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  try {
    const { token } = await params
    const invite = await prisma.invite.findUnique({
      where: { token },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
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
