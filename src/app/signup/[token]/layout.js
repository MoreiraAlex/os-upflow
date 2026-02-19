import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

export default async function SignupPage({ children, params }) {
  const incomingHeaders = headers()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invite/${params.token}`,
    {
      headers: {
        cookie: incomingHeaders.get('cookie') ?? '',
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) return notFound()
  const invite = await res.json()

  if (!invite || invite.used || invite.expiresAt < new Date()) {
    notFound()
  }

  return <>{children}</>
}
