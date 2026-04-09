'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()

  let submitting = false
  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    submitting = true

    const form = e.target

    const loginPromise = fetch('/api/auth/sign-in/username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error)

      return data
    })

    toast.promise(loginPromise, {
      loading: 'Entrando...',
      success: () => {
        router.push('/sudo')
        router.refresh()
        submitting = false
        return 'Login realizado com sucesso'
      },
      error: (e) => {
        submitting = false
        return e?.message || 'Erro ao entrar no sistema'
      },
    })
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 p-6 rounded-2xl shadow-sm border shadow-foreground"
      >
        <div className="space-y-2">
          <Label htmlFor="username">Usuário</Label>
          <Input id="username" name="username" type="text" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <Button type="submit" className="w-full hover:cursor-pointer">
          Entrar
        </Button>
      </form>
    </div>
  )
}
