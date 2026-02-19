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
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 },
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('GET_CONTACT_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao buscar contato' },
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

    const contact = await prisma.contact.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('UPDATE_CONTACT_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao atualizar contato' },
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
    await prisma.contact.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE_CONTACT_ERROR', error)

    return NextResponse.json(
      { error: 'Erro ao deletar contato' },
      { status: 500 },
    )
  }
}
