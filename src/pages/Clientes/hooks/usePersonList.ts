import { usePersonControllerCount, usePersonControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function usePersonList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: people, isLoading } = usePersonControllerFind({
    filter: {
      where,
      order: ['createdAt DESC'],
      limit: pageSize,
      skip,
      include: [{ relation: 'address' }],
    },
  })

  const { data: countResult } = usePersonControllerCount({ where })

  return {
    people: people ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
