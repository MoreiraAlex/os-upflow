'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function useCrudSheet({ endpoint, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  function openCreate() {
    setEditingItem(null)
    setOpen(true)
  }

  function openEdit(item) {
    setEditingItem(item)
    setOpen(true)
  }

  function close() {
    setOpen(false)
    setEditingItem(null)
  }

  function submit(values) {
    const request = fetch(
      editingItem
        ? `${endpoint}/${editingItem.number || editingItem.id}`
        : endpoint,
      {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      },
    ).then((res) => {
      if (!res.ok) throw new Error()
      return res.json()
    })

    toast.promise(request, {
      loading: editingItem ? 'Salvando alterações...' : 'Salvando...',
      success: () => {
        close()
        if (onSuccess) {
          onSuccess()
        }

        return editingItem ? 'Atualizado com sucesso' : 'Criado com sucesso'
      },
      error: () => 'Erro ao salvar',
    })
  }

  function remove(item) {
    const request = fetch(`${endpoint}/${item.number || item.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) throw new Error()
    })

    toast.promise(request, {
      loading: 'Removendo...',
      success: () => {
        if (onSuccess) {
          onSuccess()
        }

        return 'Removido com sucesso'
      },
      error: () => 'Erro ao remover',
    })
  }

  return {
    open,
    setOpen,
    editingItem,
    openCreate,
    openEdit,
    close,
    submit,
    remove,
  }
}
