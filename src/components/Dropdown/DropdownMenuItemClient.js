'use client'

import { SettingsIcon } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { CustomizeDialog } from '../dialogs/ConfiguracoesDialog'

export function DropdownMenuItemClient() {
  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <SettingsIcon className="w-4 mr-2" />
      <CustomizeDialog />
    </DropdownMenuItem>
  )
}
