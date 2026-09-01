import { useState } from 'react'
import { useSaleControllerCount, useSaleControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { UserInfo } from '@/auth'

export type SaleFiltersValues = {
  status: string
  sellerId: string
  buyerId: string
  sellerAgentId: string
  buyerAgentId: string
  saleDateFrom: string
  saleDateTo: string
  onlyMine: boolean
}

export const emptySaleFilters: SaleFiltersValues = {
  status: '',
  sellerId: '',
  buyerId: '',
  sellerAgentId: '',
  buyerAgentId: '',
  saleDateFrom: '',
  saleDateTo: '',
  onlyMine: false,
}

function buildWhere(search: string, filters: SaleFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) conditions.push({ number: { ilike: `%${search}%` } })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.sellerId) conditions.push({ sellerId: filters.sellerId })
  if (filters.buyerId) conditions.push({ buyerId: filters.buyerId })
  if (filters.sellerAgentId) conditions.push({ sellerAgentId: filters.sellerAgentId })
  if (filters.buyerAgentId) conditions.push({ buyerAgentId: filters.buyerAgentId })
  if (filters.saleDateFrom) conditions.push({ saleDate: { gte: filters.saleDateFrom } })
  if (filters.saleDateTo) conditions.push({ saleDate: { lte: `${filters.saleDateTo}T23:59:59.999Z` } })

  if (filters.onlyMine) {
    const userId = UserInfo.getUserId()
    if (userId) {
      conditions.push({ or: [{ sellerAgentId: userId }, { buyerAgentId: userId }, { createdById: userId }] })
    }
  }

  return conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }
}

export function useSaleList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } = useListPagination()
  const [filters, setFiltersState] = useState<SaleFiltersValues>(emptySaleFilters)

  const where = buildWhere(debouncedSearch, filters)

  const { data: sales, isLoading } = useSaleControllerFind({
    filter: {
      where,
      include: [
        { relation: 'property' },
        { relation: 'buyer' },
        { relation: 'seller' },
        { relation: 'sellerAgent' },
        { relation: 'buyerAgent' },
        { relation: 'saleBuyers', scope: { include: [{ relation: 'person' }] } },
        { relation: 'saleSellers', scope: { include: [{ relation: 'person' }] } },
      ],
      order: ['saleDate DESC'],
      limit: pageSize,
      skip,
    },
  })

  const { data: countResult } = useSaleControllerCount({ where })

  function setFilters(next: SaleFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    sales: sales ?? [],
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
