import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { cnpj, username, password } = body

    const workshop = await prisma.workshop.findUnique({
      where: {
        cnpj,
      },
    })

    if (!workshop) {
      return NextResponse.json(
        { error: 'Oficina não encontrada' },
        { status: 404 },
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        workshopId_username: {
          workshopId: workshop.id,
          username,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 },
      )
    }

    const signIn = await auth.api.signInEmail({
      body: {
        email: user.email,
        password,
      },
    })

    if (!signIn?.user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 },
      )
    }

    return NextResponse.json(signIn, { status: 201 })
  } catch (error) {
    console.error('LOGIN_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
