'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Button variant="outline" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  )
}
