'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function DataTableToolbar({ setQuery }) {
  return (
    <div className="flex items-center gap-3 justify-center">
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        <Input
          placeholder="Buscar..."
          className="pl-8 rounded-xl shadow-sm"
          onChange={(e) =>
            setQuery((p) => ({
              ...p,
              search: e.target.value,
              page: 1,
            }))
          }
        />
      </div>
    </div>
  )
}
