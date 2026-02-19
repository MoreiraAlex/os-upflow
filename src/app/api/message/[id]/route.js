import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const message = await prisma.message.findUnique({
      where: { id: Number(id) },
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 },
      )
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('GET_MESSAGE_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao buscar mensagem' },
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

    const body = await req.json()
    const { id } = await params

    const message = await prisma.message.update({
      where: { id: Number(id) },
      data: body,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('UPDATE_MESSAGE_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
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

    const { id } = await params
    await prisma.message.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE_MESSAGE_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao deletar mensagem' },
      { status: 500 },
    )
  }
}
