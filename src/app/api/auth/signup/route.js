import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, username, workshopName } = body

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        username,
        name: username,
        displayUsername: username,
      },
    })

    if (!result?.user?.id) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 },
      )
    }

    const workshop = await prisma.workshop.findUnique({
      where: { name: workshopName },
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        workshopId: workshop.id,
      },
    })

    return NextResponse.json(result.user, { status: 201 })
  } catch (error) {
    console.error('SIGNUP_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
