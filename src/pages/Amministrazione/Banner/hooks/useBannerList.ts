import { useState } from 'react'
import { useHomeBannerControllerCount, useHomeBannerControllerFind } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useBannerList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { title: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: banners, isLoading } = useHomeBannerControllerFind({
    filter: {
      where,
      order: ['displayOrder ASC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = useHomeBannerControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    banners: banners ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
