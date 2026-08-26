import { useBranchControllerCount, useBranchControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useBranchList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: branches, isLoading } = useBranchControllerFind({
    filter: { where, order: ['name ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = useBranchControllerCount({ where })

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
