'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'

export function CustomizeDialog() {
  const { theme, setTheme } = useTheme()

  return (
    <Dialog>
      <DialogTrigger>Personalizar</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizações do Sistema</DialogTitle>
          <DialogDescription>
            Ajuste preferências gerais da aplicação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <Label>Tema Escuro</Label>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) =>
                setTheme(checked ? 'dark' : 'light')
              }
              className="hover:cursor-pointer"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
