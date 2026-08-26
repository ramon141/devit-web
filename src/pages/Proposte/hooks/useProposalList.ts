import {
  usePurchaseProposalControllerCount,
  usePurchaseProposalControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useProposalList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: proposals, isLoading } = usePurchaseProposalControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'buyer' }],
      order: ['proposalDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = usePurchaseProposalControllerCount({ where })

  return {
    proposals: proposals ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}
