import { useState } from 'react'
import {
  useRentalContractControllerCount,
  useRentalContractControllerFind,
} from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export function useRentalContractList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const where = debouncedSearch ? { number: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: contracts, isLoading } = useRentalContractControllerFind({
    filter: {
      where,
      include: [{ relation: 'property' }, { relation: 'tenant' }, { relation: 'owner' }],
      order: ['startDate DESC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = useRentalContractControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  return {
    contracts: contracts ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
  }
}
