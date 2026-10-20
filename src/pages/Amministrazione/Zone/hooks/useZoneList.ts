import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useZoneControllerCount, useZoneControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

export function useZoneList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : undefined

  const { data: zones, isLoading } = useZoneControllerFind({
    filter: { where, order: ['city ASC', 'name ASC'], limit: pageSize, skip },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = useZoneControllerCount({ where }, KEEP_PREVIOUS_DATA)

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
