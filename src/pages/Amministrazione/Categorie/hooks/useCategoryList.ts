import { useState } from 'react'
import {
  usePropertyCategoryControllerCount,
  usePropertyCategoryControllerFind,
} from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useCategoryList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: categories, isLoading } = usePropertyCategoryControllerFind({
    filter: {
      where,
      order: ['displayOrder ASC', 'name ASC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = usePropertyCategoryControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    categories: categories ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
