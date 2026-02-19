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

    const { searchParams } = new URL(req.url)
    const contactId = searchParams.get('contactId')

    const messages = await prisma.message.findMany({
      where: contactId ? { contactId } : {},
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('LIST_MESSAGES_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
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

    const body = await req.json()

    const { contactId, direction, type, content } = body

    if (!contactId || !direction || !type || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 },
      )
    }

    const message = await prisma.message.create({
      data: {
        contactId,
        direction,
        type,
        content,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('CREATE_MESSAGE_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao criar mensagem' },
      { status: 500 },
    )
  }
}
