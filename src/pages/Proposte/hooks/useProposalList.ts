import { useState } from 'react'
import {
  usePurchaseProposalControllerCount,
  usePurchaseProposalControllerFind,
} from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useProposalList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: proposals, isLoading } = usePurchaseProposalControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'buyer' }],
      order: ['proposalDate DESC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = usePurchaseProposalControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    proposals: proposals ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
