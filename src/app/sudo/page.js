'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatarCNPJ, validarCNPJ } from '@/lib/utils'

export default function SudoPage() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [suffix, setSuffix] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)
  const [role, setRole] = useState('admin')
  const [cnpj, setCnpj] = useState('')
  const [cnpjError, setCnpjError] = useState('')

  async function loadInvites() {
    setLoading(true)
    try {
      const res = await fetch('/api/invite', { cache: 'no-store' })
      if (!res.ok) throw new Error()

      const json = await res.json()
      setInvites(json)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao carregar invites')
    } finally {
      setLoading(false)
    }
  }

  async function generateToken() {
    if (!suffix.trim()) {
      toast.error('Informe um sufixo para o token')
      return
    }

    if (generating) return
    setGenerating(true)

    const promise = fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suffix }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error()
        const json = await res.json()

        await navigator.clipboard.writeText(json.link)
        setSuffix('')
        await loadInvites()

        return json
      })
      .finally(() => {
        setGenerating(false)
      })

    toast.promise(promise, {
      loading: 'Gerando token...',
      success: 'Token gerado e link copiado!',
      error: 'Erro ao gerar token',
    })
  }

  async function copyLink(token) {
    try {
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/signup/${token}`
      await navigator.clipboard.writeText(link)
      toast.success('Link copiado!')
    } catch {
      toast.error('Erro ao copiar link')
    }
  }

  useEffect(() => {
    loadInvites()
  }, [])

  function getStatus(invite) {
    if (invite.used) return 'used'
    if (new Date(invite.expiresAt) < new Date()) return 'expired'
    return 'active'
  }

  function handleCnpjChange(e) {
    const formatted = formatarCNPJ(e.target.value)
    setCnpj(formatted)
    setCnpjError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (creatingUser) return
    setCreatingUser(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const cnpjRaw = String(formData.get('cnpj') || '')
    const cnpjLimpo = cnpjRaw.replace(/\D/g, '')

    if (!validarCNPJ(cnpjRaw)) {
      setCnpjError('CNPJ inválido')
      setCreatingUser(false)
      return
    }

    const payload = {
      cnpj: cnpjLimpo,
      username: String(formData.get('username') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      role,
    }

    const promise = fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error()
      })
      .finally(() => {
        setCreatingUser(false)
        e.target.reset()
        setCnpj('')
      })

    toast.promise(promise, {
      loading: 'Criando usuário...',
      success: 'Usuário criado!',
      error: 'Erro ao criar usuário',
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold leading-none">
              Painel do Sistema
            </h1>
            <p className="text-sm text-muted-foreground">
              Área administrativa (sudo)
            </p>
          </div>
        </div>

        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href="/">Voltar ao sistema</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Convites</CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Sufixo (ex: oficina-silva)"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              required
            />

            <Button onClick={generateToken} disabled={generating}>
              {generating ? 'Gerando...' : 'Gerar token'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-96">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))
              : invites.map((invite) => {
                  const status = getStatus(invite)

                  return (
                    <div
                      key={invite.id}
                      className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 "
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/signup/${invite.token}`}
                      target="_blank"
                    >
                      <Link
                        key={invite.id}
                        className="min-w-0 p-2 rounded-lg hover:bg-muted/50 transition"
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}/signup/${invite.token}`}
                        target="_blank"
                      >
                        <p className="font-mono text-sm break-all">
                          {invite.token}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expira em:{' '}
                          {new Date(invite.expiresAt).toLocaleString('pt-BR')}
                        </p>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {status === 'active' && 'Ativo'}
                          {status === 'used' && 'Usado'}
                          {status === 'expired' && 'Expirado'}
                        </Badge>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyLink(invite.token)}
                              >
                                <Copy />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copiar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )
                })}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar usuário</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="mt-2 space-y-4"
            autoComplete="false"
          >
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={cnpj}
                onChange={handleCnpjChange}
                required
              />
              {cnpjError && <p className="text-sm text-red-500">{cnpjError}</p>}
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

            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="su">Super User</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={creatingUser}
              className="w-full hover:cursor-pointer"
            >
              {creatingUser ? 'Criando...' : 'Criar conta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
