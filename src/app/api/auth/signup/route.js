import { auth } from '@/lib/auth'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, username } = body

    if (!email || !password || !username) {
      return Response.json(
        { error: 'Dados obrigatórios ausentes' },
        { status: 400 },
      )
    }

    await auth.api.signUpEmail({
      body: {
        email,
        username,
        password,
        name: username,
        displayUsername: username,
      },
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('SIGNUP ERROR:', err)

    return Response.json(
      {
        error: err.message,
        details: err,
      },
      { status: 400 },
    )
  }
}
