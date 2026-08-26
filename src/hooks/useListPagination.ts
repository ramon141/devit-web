import { useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'

export function useListPagination() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    search,
    debouncedSearch,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    onSearchChange: handleSearchChange,
  }
}
