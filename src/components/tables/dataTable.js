'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from '@/components/ui/table'

import { ArrowUpDown } from 'lucide-react'
import { DataTablePagination } from '@/components/tables/pagination'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function DataTable({
  columns,
  data,
  pagination,
  setQuery,
  query,
  loading = false,
}) {
  const [sorting, setSorting] = useState(
    query.sort
      ? [
          {
            id: query.sort.split(':')[0],
            desc: query.sort.split(':')[1] === 'desc',
          },
        ]
      : [],
  )

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,

    state: {
      sorting,
    },

    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(next)
      const s = next && next[0]

      if (!s) {
        setQuery((prev) => ({ ...prev, sort: '', page: 1 }))
        return
      }

      setQuery((prev) => ({
        ...prev,
        sort: `${s.id}:${s.desc ? 'desc' : 'asc'}`,
        page: 1,
      }))
    },

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="border rounded-xl shadow-sm overflow-x-auto overflow-y-auto h-[60vh] sm:h-[65vh] bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <TableHead
                      key={header.id}
                      className={`font-semibold whitespace-nowrap ${
                        canSort
                          ? 'cursor-pointer select-none hover:bg-muted/70'
                          : ''
                      } transition-colors`}
                      onClick={() => canSort && header.column.toggleSorting()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <ArrowUpDown
                            className={`w-4 h-4 opacity-50 ${
                              sorted ? 'opacity-100 text-primary' : ''
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(10)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-3 px-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors odd:bg-muted/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-3 text-sm whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination pagination={pagination} setQuery={setQuery} />
    </div>
  )
}
