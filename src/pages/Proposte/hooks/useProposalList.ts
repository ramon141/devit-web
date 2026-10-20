import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useState } from 'react'
import {
  usePurchaseProposalControllerCount,
  usePurchaseProposalControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { useBrokerListParams } from '@/hooks/useBrokerListParams'
import { toLikePattern } from '@/utils/toLikePattern'

export type ProposalFiltersValues = {
  status: string
  financed: string
  propertyId: string
  buyerId: string
  brokerCode: string
  proposalDateFrom: string
  proposalDateTo: string
  onlyMine: boolean
}

export const emptyProposalFilters: ProposalFiltersValues = {
  status: '',
  financed: '',
  propertyId: '',
  buyerId: '',
  brokerCode: '',
  proposalDateFrom: '',
  proposalDateTo: '',
  onlyMine: false,
}

function buildWhere(search: string, filters: ProposalFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) conditions.push({ number: { ilike: toLikePattern(search) } })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.financed) conditions.push({ financed: filters.financed === 'true' })
  if (filters.propertyId) conditions.push({ propertyId: filters.propertyId })
  if (filters.buyerId) conditions.push({ buyerId: filters.buyerId })
  if (filters.proposalDateFrom) conditions.push({ proposalDate: { gte: filters.proposalDateFrom } })
  if (filters.proposalDateTo) {
    conditions.push({ proposalDate: { lte: `${filters.proposalDateTo}T23:59:59.999Z` } })
  }


  return conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }
}

export function useProposalList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [filters, setFiltersState] = useState<ProposalFiltersValues>(emptyProposalFilters)

  const where = buildWhere(debouncedSearch, filters)
  const brokerParams = useBrokerListParams(filters)

  const { data: proposals, isLoading } = usePurchaseProposalControllerFind({
    ...brokerParams,
    filter: {
      where,
      include: [
        { relation: 'property', scope: { include: [{ relation: 'responsibleBroker' }] } },
        { relation: 'buyer' },
        { relation: 'createdBy' },
        { relation: 'sale' },
      ],
      order: ['proposalDate DESC'],
      limit: pageSize,
      skip,
    },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = usePurchaseProposalControllerCount({ where, ...brokerParams }, KEEP_PREVIOUS_DATA)

  function setFilters(next: ProposalFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    proposals: proposals ?? [],
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
