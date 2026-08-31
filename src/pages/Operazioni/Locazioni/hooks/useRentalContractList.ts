import {
  useRentalContractControllerCount,
  useRentalContractControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useRentalContractList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: contracts, isLoading } = useRentalContractControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'tenant' }, { relation: 'owner' }],
      order: ['startDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = useRentalContractControllerCount({ where })

  return {
    contracts: contracts ?? [],
    where,
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
