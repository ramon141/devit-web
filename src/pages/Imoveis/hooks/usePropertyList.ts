import { useState } from 'react'
import { usePropertyControllerCount, usePropertyControllerFind } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'


export type PropertyFiltersValues = {
  categoryId: string
  purpose: string
  status: string
  priceMin: string
  priceMax: string
}

export const emptyPropertyFilters: PropertyFiltersValues = {
  categoryId: '',
  purpose: '',
  status: '',
  priceMin: '',
  priceMax: '',
}

function buildWhere(search: string, filters: PropertyFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) {
    conditions.push({
      or: [{ title: { ilike: `%${search}%` } }, { code: { ilike: `%${search}%` } }],
    })
  }
  if (filters.categoryId) conditions.push({ categoryId: filters.categoryId })
  if (filters.purpose) conditions.push({ purpose: filters.purpose })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.priceMin) conditions.push({ salePrice: { gte: Number(filters.priceMin) } })
  if (filters.priceMax) conditions.push({ salePrice: { lte: Number(filters.priceMax) } })

  return conditions.length > 0 ? { and: conditions } : undefined
}

export function usePropertyList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFiltersState] = useState<PropertyFiltersValues>(emptyPropertyFilters)
  const debouncedSearch = useDebouncedValue(search)

  const where = buildWhere(debouncedSearch, filters)

  const { data: allProperties, isLoading } = usePropertyControllerFind({
    filter: {
      where,
      include: [{ relation: 'category' }, { relation: 'address' }, { relation: 'owner' }],
      order: ['createdAt DESC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = usePropertyControllerCount({ where })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function setFilters(next: PropertyFiltersValues) {
    setFiltersState(next)
    setPage(1)
  }

  return {
    properties: allProperties ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    search,
    onSearchChange: handleSearchChange,
    filters,
    setFilters,
  }
}
