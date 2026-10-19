import { useState } from 'react'
import {
  useRentalContractControllerCount,
  useRentalContractControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { useBrokerListParams } from '@/hooks/useBrokerListParams'
import { toLikePattern } from '@/utils/toLikePattern'

export type RentalContractFiltersValues = {
  situation: string
  ownerId: string
  tenantId: string
  brokerCode: string
  stipulaDateFrom: string
  stipulaDateTo: string
  startDateFrom: string
  startDateTo: string
  onlyMine: boolean
}

export const emptyRentalContractFilters: RentalContractFiltersValues = {
  situation: '',
  ownerId: '',
  tenantId: '',
  brokerCode: '',
  stipulaDateFrom: '',
  stipulaDateTo: '',
  startDateFrom: '',
  startDateTo: '',
  onlyMine: false,
}

function buildWhere(search: string, filters: RentalContractFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) conditions.push({ number: { ilike: toLikePattern(search) } })
  if (filters.situation) conditions.push({ situation: filters.situation })
  if (filters.ownerId) conditions.push({ ownerId: filters.ownerId })
  if (filters.tenantId) conditions.push({ tenantId: filters.tenantId })
  if (filters.stipulaDateFrom) conditions.push({ stipulaDate: { gte: filters.stipulaDateFrom } })
  if (filters.stipulaDateTo) {
    conditions.push({ stipulaDate: { lte: `${filters.stipulaDateTo}T23:59:59.999Z` } })
  }
  if (filters.startDateFrom) conditions.push({ startDate: { gte: filters.startDateFrom } })
  if (filters.startDateTo) {
    conditions.push({ startDate: { lte: `${filters.startDateTo}T23:59:59.999Z` } })
  }


  return conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }
}

export function useRentalContractList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [filters, setFiltersState] = useState<RentalContractFiltersValues>(emptyRentalContractFilters)

  const where = buildWhere(debouncedSearch, filters)
  const brokerParams = useBrokerListParams(filters)

  const { data: contracts, isLoading } = useRentalContractControllerFind({
    ...brokerParams,
    filter: {
      where,
      include: [
        { relation: 'property', scope: { include: [{ relation: 'responsibleBroker' }] } },
        { relation: 'tenant' },
        { relation: 'owner' },
        { relation: 'rentalContractOwners', scope: { include: [{ relation: 'person' }] } },
        { relation: 'rentalContractTenants', scope: { include: [{ relation: 'person' }] } },
      ],
      order: ['startDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = useRentalContractControllerCount({ where, ...brokerParams })

  function setFilters(next: RentalContractFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    contracts: contracts ?? [],
    where,
    brokerParams,
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    filters,
    setFilters,
  }
}
