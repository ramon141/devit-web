import {
  usePropertyCategoryControllerCount,
  usePropertyCategoryControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useCategoryList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: categories, isLoading } = usePropertyCategoryControllerFind({
    filter: { where, order: ['displayOrder ASC', 'name ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = usePropertyCategoryControllerCount({ where })

  return {
    categories: categories ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
