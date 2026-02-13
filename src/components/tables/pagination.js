'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function DataTablePagination({ pagination, setQuery }) {
  const { page, totalPages } = pagination

  return (
    <div className="flex justify-center items-center gap-6 py-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full hover:cursor-pointer"
        disabled={page === 1}
        onClick={() => setQuery((p) => ({ ...p, page: page - 1 }))}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="text-sm text-muted-foreground">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        size="sm"
        className="rounded-full hover:cursor-pointer"
        disabled={page === totalPages}
        onClick={() => setQuery((p) => ({ ...p, page: page + 1 }))}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
