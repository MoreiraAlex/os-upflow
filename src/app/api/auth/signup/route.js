import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
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

  const userId = result.user.id
  const workshop = await prisma.workshop.findUnique({
    where: { name: workshopName },
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      workshopId: workshop.id,
    },
  })

  return Response.json({ ok: true })
}
