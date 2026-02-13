export const columns = [
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
  },
  {
    accessorKey: 'createdAt',
    header: 'Criada em',
    accessorFn: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR') : '-',
  },
]
