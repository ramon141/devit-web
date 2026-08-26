import { useSaleControllerCount, useSaleControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useSaleList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: sales, isLoading } = useSaleControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'buyer' }, { relation: 'seller' }],
      order: ['saleDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = useSaleControllerCount({ where })

  return {
    sales: sales ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
