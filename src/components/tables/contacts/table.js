'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/tables/dataTable'
import { columns as baseColumns } from '@/components/tables/contacts/columns'
import { DataTableToolbar } from '@/components/tables/toolbar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'

import { useCrudSheet } from '@/hooks/useCrudSheet'
import { ContactForm } from '@/components/forms/contactForm'

export function ContactTable() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  })

  const [query, setQuery] = useState({
    page: 1,
    limit: 8,
    sort: '',
  })

  async function fetchOrders() {
    const params = new URLSearchParams(query)

    const res = await fetch(`/api/contact?${params.toString()}`)
    const json = await res.json()

    setData(json.data)
    setPagination(json.pagination)
  }

  useEffect(() => {
    fetchOrders()
  }, [query])

  const { open, setOpen, editingItem, openCreate, openEdit, submit, remove } =
    useCrudSheet({
      endpoint: '/api/contact',
      onSuccess: fetchOrders,
    })

  const cols = baseColumns({
    onEdit: (row) => openEdit(row),
    onDelete: (row) => remove(row),
  })

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 ">
        <DataTableToolbar setQuery={setQuery} />

        <Button
          onClick={openCreate}
          className="w-full sm:w-auto hover:cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo contato
        </Button>
      </div>

      <DataTable
        columns={cols}
        data={data}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:w-[480px] p-4 sm:p-6">
          <SheetHeader className="mb-4">
            <SheetTitle>
              {editingItem ? 'Editar Contato' : 'Novo Contato'}
            </SheetTitle>
            <SheetDescription>Preencha os dados abaixo.</SheetDescription>
          </SheetHeader>

          <ContactForm
            defaultValues={editingItem || undefined}
            onSubmit={submit}
            onCancel={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
