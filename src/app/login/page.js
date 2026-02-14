'use client'

import { Logo } from '@/components/image/logo'
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
    }).then((res) => {
      if (!res.ok) throw new Error()
      return res.json()
    })

    toast.promise(loginPromise, {
      loading: 'Entrando...',
      success: () => {
        router.push('/')
        router.refresh()
        submitting = false
        return 'Login realizado com sucesso'
      },
      error: () => {
        submitting = false
        return 'Usuário ou senha inválidos'
      },
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10">
      <div className="flex items-center justify-center px-6 lg:col-span-3">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Logo width={800} height={250} />

            <p className="mt-1 text-sm text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
      </div>

      <div className="hidden lg:flex items-center justify-center bg-primary text-primary-foreground px-12 lg:col-span-7">
        <div className="max-w-md">
          <h3 className="text-3xl font-semibold leading-tight">
            Controle total das ordens
            <br />
            em um único painel
          </h3>

          <p className="mt-4 text-sm text-primary-foreground/80">
            O OS Upflow centraliza a criação, visualização e edição de ordens de
            serviço em um painel simples e organizado, enquanto o WhatsApp cuida
            do atendimento e da automação.
          </p>

          <p className="mt-2 text-sm text-primary-foreground/70">
            Tenha histórico, status e dados sempre à mão — sem perder mensagens
            ou controle do processo.
          </p>
        </div>
      </div>
    </div>
  )
}
