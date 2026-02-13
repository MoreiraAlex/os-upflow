'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function LoginPage() {
  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    })

    if (!res.ok) {
      alert('Email ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">OS Upflow</h1>
          </div>

          <h2 className="text-xl font-semibold">Entrar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="voce@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <Separator className="my-6" />

          <p className="text-sm text-muted-foreground">
            Não tem conta?{' '}
            <a
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Criar conta
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-[#0f3d2e] text-white px-12">
        <div className="max-w-md">
          <h3 className="text-3xl font-semibold leading-tight">
            Organize ordens de serviço
            <br />
            direto pelo WhatsApp
          </h3>

          <p className="mt-4 text-sm text-white/80">
            O OS Upflow ajuda oficinas e autocenters a centralizar atendimentos,
            organizar serviços e acompanhar o status das ordens em um único
            lugar.
          </p>

          <a
            href="#"
            className="inline-block mt-6 text-sm underline underline-offset-4"
          >
            Saiba mais →
          </a>
        </div>
      </div>
    </div>
  )
}
