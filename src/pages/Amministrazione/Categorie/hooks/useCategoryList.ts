import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import {
  usePropertyCategoryControllerCount,
  usePropertyCategoryControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

export function useCategoryList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : undefined

  const { data: categories, isLoading } = usePropertyCategoryControllerFind({
    filter: { where, order: ['displayOrder ASC', 'name ASC'], limit: pageSize, skip },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = usePropertyCategoryControllerCount({ where }, KEEP_PREVIOUS_DATA)

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
