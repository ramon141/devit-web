import { useState } from 'react'
import { useUserControllerCount, useUserControllerFind } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useUserList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { fullName: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: users, isLoading } = useUserControllerFind({
    filter: {
      where,
      order: ['fullName ASC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = useUserControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    users: users ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
