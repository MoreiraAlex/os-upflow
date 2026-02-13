'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/tables/dataTable'
import { columns } from '@/components/tables/order/columns'
import { DataTableToolbar } from '@/components/tables/toolbar'

export function ServiceOrdersTable() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  })

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    sort: '',
  })

  async function fetchOrders() {
    const params = new URLSearchParams(query)

    const res = await fetch(`/api/order?${params.toString()}`)
    const json = await res.json()

    setData(json.data)
    setPagination(json.pagination)
  }

  useEffect(() => {
    fetchOrders()
  }, [query])

  return (
    <>
      <DataTableToolbar setQuery={setQuery} />
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
      />
    </>
  )
}
