import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useState } from 'react'
import { useSaleControllerCount, useSaleControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { useBrokerListParams } from '@/hooks/useBrokerListParams'
import { toLikePattern } from '@/utils/toLikePattern'

export type SaleFiltersValues = {
  status: string
  sellerId: string
  buyerId: string
  brokerCode: string
  saleDateFrom: string
  saleDateTo: string
  onlyMine: boolean
}

export const emptySaleFilters: SaleFiltersValues = {
  status: '',
  sellerId: '',
  buyerId: '',
  brokerCode: '',
  saleDateFrom: '',
  saleDateTo: '',
  onlyMine: false,
}

function buildWhere(search: string, filters: SaleFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) conditions.push({ number: { ilike: toLikePattern(search) } })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.sellerId) conditions.push({ sellerId: filters.sellerId })
  if (filters.buyerId) conditions.push({ buyerId: filters.buyerId })
  if (filters.saleDateFrom) conditions.push({ saleDate: { gte: filters.saleDateFrom } })
  if (filters.saleDateTo) conditions.push({ saleDate: { lte: `${filters.saleDateTo}T23:59:59.999Z` } })


  return conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }
}

export function useSaleList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } = useListPagination()
  const [filters, setFiltersState] = useState<SaleFiltersValues>(emptySaleFilters)

  const where = buildWhere(debouncedSearch, filters)
  const brokerParams = useBrokerListParams(filters)

  const { data: sales, isLoading } = useSaleControllerFind({
    ...brokerParams,
    filter: {
      where,
      include: [
        { relation: 'property', scope: { include: [{ relation: 'responsibleBroker' }] } },
        { relation: 'buyer' },
        { relation: 'seller' },
        { relation: 'saleBuyers', scope: { include: [{ relation: 'person' }] } },
        { relation: 'saleSellers', scope: { include: [{ relation: 'person' }] } },
      ],
      order: ['saleDate DESC'],
      limit: pageSize,
      skip,
    },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = useSaleControllerCount({ where, ...brokerParams }, KEEP_PREVIOUS_DATA)

  function setFilters(next: SaleFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    sales: sales ?? [],
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
