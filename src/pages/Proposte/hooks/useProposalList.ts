import { useState } from 'react'
import {
  usePurchaseProposalControllerCount,
  usePurchaseProposalControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { UserInfo } from '@/auth'

export type ProposalFiltersValues = {
  status: string
  financed: string
  propertyId: string
  buyerId: string
  sellerAgentId: string
  assignedToId: string
  proposalDateFrom: string
  proposalDateTo: string
  onlyMine: boolean
}

export const emptyProposalFilters: ProposalFiltersValues = {
  status: '',
  financed: '',
  propertyId: '',
  buyerId: '',
  sellerAgentId: '',
  assignedToId: '',
  proposalDateFrom: '',
  proposalDateTo: '',
  onlyMine: false,
}

function buildWhere(search: string, filters: ProposalFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) conditions.push({ number: { ilike: `%${search}%` } })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.financed) conditions.push({ financed: filters.financed === 'true' })
  if (filters.propertyId) conditions.push({ propertyId: filters.propertyId })
  if (filters.buyerId) conditions.push({ buyerId: filters.buyerId })
  if (filters.sellerAgentId) conditions.push({ sellerAgentId: filters.sellerAgentId })
  if (filters.assignedToId) conditions.push({ assignedToId: filters.assignedToId })
  if (filters.proposalDateFrom) conditions.push({ proposalDate: { gte: filters.proposalDateFrom } })
  if (filters.proposalDateTo) {
    conditions.push({ proposalDate: { lte: `${filters.proposalDateTo}T23:59:59.999Z` } })
  }

  if (filters.onlyMine) {
    const userId = UserInfo.getUserId()
    if (userId) {
      conditions.push({ or: [{ sellerAgentId: userId }, { assignedToId: userId }, { createdById: userId }] })
    }
  }

  return conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }
}

export function useProposalList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [filters, setFiltersState] = useState<ProposalFiltersValues>(emptyProposalFilters)

  const where = buildWhere(debouncedSearch, filters)

  const { data: proposals, isLoading } = usePurchaseProposalControllerFind({
    filter: {
      where,
      include: [
        { relation: 'property' },
        { relation: 'buyer' },
        { relation: 'createdBy' },
        { relation: 'sellerAgent' },
        { relation: 'assignedTo' },
        { relation: 'sale' },
      ],
      order: ['proposalDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = usePurchaseProposalControllerCount({ where })

  function setFilters(next: ProposalFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    proposals: proposals ?? [],
    where,
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
