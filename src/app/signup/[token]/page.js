'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignupPage() {
  const { token } = useParams()
  const router = useRouter()
  let submitting = false

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    submitting = true

    const form = e.target

    const signupPromise = fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cnpj: form.cnpj.value,
        workshopName: form.workshop.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        token,
      }),
    }).then((res) => {
      if (!res.ok) throw new Error()
      return res.json()
    })

    toast.promise(signupPromise, {
      loading: 'Criando conta...',
      success: () => {
        router.push('/')
        router.refresh()
        submitting = false
        return 'Conta criada com sucesso'
      },
      error: () => {
        submitting = false
        return 'Erro ao criar conta'
      },
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10">
      <div className="flex items-center justify-center px-6 lg:col-span-3">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">OS Upflow</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua conta para acessar o painel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workshop">Empresa</Label>
              <Input id="workshop" name="workshop" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" name="cnpj" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" name="username" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full hover:cursor-pointer">
              Criar conta
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-primary text-primary-foreground px-12 lg:col-span-7">
        <div className="max-w-md">
          <h3 className="text-3xl font-semibold leading-tight">
            Comece organizando
            <br />
            suas ordens hoje
          </h3>

          <p className="mt-4 text-sm text-primary-foreground/80">
            Crie sua oficina, gerencie ordens de serviço e acompanhe tudo em um
            painel simples, pensado para o dia a dia da oficina.
          </p>

          <p className="mt-2 text-sm text-primary-foreground/70">
            Automatize atendimentos pelo WhatsApp sem perder controle ou
            histórico.
          </p>
        </div>
      </div>
    </div>
  )
}
