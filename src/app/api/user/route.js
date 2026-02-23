import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        workshop: true,
      },
    })

    if (!user?.workshopId) {
      return NextResponse.json(
        { error: 'User has no workshop' },
        { status: 400 },
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('GET_USER_ERROR', error)

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
      select: { role: true },
    })

    if (user?.role !== 'su') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { email, password, username, cnpj, role } = body

    const workshop = await prisma.workshop.findUnique({
      where: {
        cnpj,
      },
    })

    const signUp = await auth.api.signUpEmail({
      body: {
        email,
        password,
        username,
        name: username,
        displayUsername: username,
      },
    })

    if (!signUp?.user?.id) {
      throw new Error('Falha ao criar usuário')
    }

    await prisma.user.update({
      where: { id: signUp.user.id },
      data: {
        workshopId: workshop.id,
        role,
      },
    })

    const newUser = signUp.user
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('SIGNUP_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
