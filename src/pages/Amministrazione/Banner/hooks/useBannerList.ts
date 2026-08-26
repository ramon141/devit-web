import { useHomeBannerControllerCount, useHomeBannerControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useBannerList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { title: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: banners, isLoading } = useHomeBannerControllerFind({
    filter: { where, order: ['displayOrder ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = useHomeBannerControllerCount({ where })

  return {
    banners: banners ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
