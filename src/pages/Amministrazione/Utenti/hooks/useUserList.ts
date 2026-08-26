import { useUserControllerCount, useUserControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useUserList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { fullName: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: users, isLoading } = useUserControllerFind({
    filter: { where, order: ['fullName ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = useUserControllerCount({ where })

  return {
    users: users ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
