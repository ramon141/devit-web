import { useZoneControllerCount, useZoneControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useZoneList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: zones, isLoading } = useZoneControllerFind({
    filter: { where, order: ['city ASC', 'name ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = useZoneControllerCount({ where })

  return {
    zones: zones ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
