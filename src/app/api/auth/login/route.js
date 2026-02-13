import { auth } from '@/lib/auth'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 },
      )
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })

    return Response.json({
      ok: true,
      user: result.user,
    })
  } catch (err) {
    console.error('LOGIN ERROR:', err)

    return Response.json(
      {
        error: err.message ?? 'Falha ao autenticar',
      },
      { status: 401 },
    )
  }
}
