import { DeleteDialog } from '@/components/dialogs/deleteDialogs'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EditIcon, Trash2 } from 'lucide-react'

const STATUS_LABEL = {
  1: 'Aberta',
  2: 'Em andamento',
  3: 'Concluída',
  4: 'Cancelada',
}

export const columns = ({ onEdit, onDelete }) => [
  {
    accessorKey: 'number',
    header: 'OS',
    cell: ({ row }) => `#${row.getValue('number')}`,
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => row.getValue('client') || '—',
  },
  {
    accessorKey: 'vehicle',
    header: 'Veículo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => STATUS_LABEL[row.getValue('status')] ?? '—',
  },
  {
    accessorKey: 'createdAt',
    header: 'Criada em',
    accessorFn: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR') : '-',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const item = row.original

      return (
        <TooltipProvider>
          <div className="flex gap-2 justify-end">
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
                    description={`Deseja deletar a ordem de serviço #${item.number}?`}
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
