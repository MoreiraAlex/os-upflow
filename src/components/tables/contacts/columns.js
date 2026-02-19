import { DeleteDialog } from '@/components/dialogs/deleteDialogs'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EditIcon, Trash2 } from 'lucide-react'

export const columns = ({ onEdit, onDelete }) => [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.getValue('name') || '—',
  },
  {
    accessorKey: 'phone',
    header: 'Número',
    cell: ({ row }) => {
      const phone = String(row.getValue('phone') || '')

      const cleaned = phone.replace(/\D/g, '')

      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      }

      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
      }

      return phone
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const item = row.original

      return (
        <TooltipProvider>
          <div className="flex gap-1 justify-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => onEdit(item)}>
                  <EditIcon className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DeleteDialog
                    buttonTrigger={
                      <Button variant="destructive">
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    }
                    description={`Deseja deletar esse numero: ${item.phone}?`}
                    onClick={() => onDelete(item)}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    },
  },
]
