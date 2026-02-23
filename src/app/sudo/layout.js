import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function SudoLayout({ children }) {
  const incomingHeaders = headers()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    headers: {
      cookie: incomingHeaders.get('cookie') ?? '',
    },
    cache: 'no-store',
  })

  if (!res.ok) return notFound()
  const user = await res.json()

  if (user.role !== 'su') {
    return notFound()
  }

  return <>{children}</>
}
