import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useBranchControllerCount, useBranchControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

export function useBranchList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : undefined

  const { data: branches, isLoading } = useBranchControllerFind({
    filter: { where, order: ['name ASC'], limit: pageSize, skip },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = useBranchControllerCount({ where }, KEEP_PREVIOUS_DATA)

  return {
    branches: branches ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
