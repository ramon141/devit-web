import { useState } from 'react'
import { useSaleControllerCount, useSaleControllerFind } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useSaleList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: sales, isLoading } = useSaleControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'buyer' }, { relation: 'seller' }],
      order: ['saleDate DESC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = useSaleControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    sales: sales ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
