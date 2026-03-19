import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization')
    const sessionBearer = await auth.api.getSession({
      headers: {
        authorization: authHeader,
      },
    })

    if (!sessionBearer?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { phone } = await params
    const contact = await prisma.contact.findUnique({
      where: { phone },
      select: {
        id: true,
      },
    })

    if (!contact?.id) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
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
