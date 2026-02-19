import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, username, workshopName, token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token obrigatório' }, { status: 400 })
    }

    const invite = await prisma.invite.findUnique({
      where: { token },
    })

    if (!invite || invite.used || invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Convite inválido ou expirado' },
        { status: 400 },
      )
    }

    const result = await prisma.$transaction(async (tx) => {
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

      const workshop = await tx.workshop.create({
        data: {
          name: workshopName,
        },
      })

      await tx.user.update({
        where: { id: signUp.user.id },
        data: {
          workshopId: workshop.id,
        },
      })

      await tx.invite.update({
        where: { token },
        data: { used: true },
      })

      return signUp.user
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('SIGNUP_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
