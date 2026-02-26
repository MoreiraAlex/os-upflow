import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buscarCNPJ } from '@/lib/utils'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, username, cnpj, token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token obrigatório' }, { status: 400 })
    }

    const invite = await prisma.invite.findUnique({
      where: { token },
    })

    const now = new Date()
    const expiresAt = new Date(invite?.expiresAt)

    if (!invite || invite?.used || expiresAt < now) {
      return NextResponse.json(
        { error: 'Convite inválido ou expirado' },
        { status: 400 },
      )
    }

    const workshopExists = await prisma.workshop.findUnique({
      where: { cnpj },
    })

    if (workshopExists) {
      throw new Error('CNPJ já existe')
    }

    const cnpjData = await buscarCNPJ(cnpj)
    console.log(cnpjData)

    if (!cnpjData) {
      return NextResponse.json(
        { error: 'CNPJ não encontrado na Receita' },
        { status: 400 },
      )
    }

    const workshop = await prisma.workshop.create({
      data: {
        cnpj,
        name: cnpjData.name,
        fantasyName: cnpjData.fantasyName,
        email: cnpjData.email,
        phone: cnpjData.phone,
        address: cnpjData.address,
        number: cnpjData.number,
        district: cnpjData.district,
        city: cnpjData.city,
        state: cnpjData.state,
        zipCode: cnpjData.zipCode,
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
        role: 'admin',
      },
    })

    await prisma.invite.update({
      where: { token },
      data: { used: true },
    })

    return NextResponse.json(signUp.user, { status: 201 })
  } catch (error) {
    console.error('SIGNUP_ERROR', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
