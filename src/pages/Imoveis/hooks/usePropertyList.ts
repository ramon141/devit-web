import { useState } from 'react'
import { usePropertyControllerCount, usePropertyControllerFind } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PAGE_SIZE } from '@/constants/pagination'

export type PropertyOrderBy =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'code_asc'
  | 'code_desc'
  | 'salePrice_asc'
  | 'salePrice_desc'

export type PropertyFiltersValues = {
  categoryId: string
  purpose: string
  status: string
  priceMin: string
  priceMax: string
  ownerId: string
  bedroomsMin: string
  bedroomsMax: string
  bathroomsMin: string
  bathroomsMax: string
  areaMin: string
  areaMax: string
  orderBy: PropertyOrderBy
}

export const emptyPropertyFilters: PropertyFiltersValues = {
  categoryId: '',
  purpose: '',
  status: '',
  priceMin: '',
  priceMax: '',
  ownerId: '',
  bedroomsMin: '',
  bedroomsMax: '',
  bathroomsMin: '',
  bathroomsMax: '',
  areaMin: '',
  areaMax: '',
  orderBy: 'createdAt_desc',
}

const orderByMap: Record<PropertyOrderBy, string[]> = {
  createdAt_desc: ['createdAt DESC'],
  createdAt_asc: ['createdAt ASC'],
  code_asc: ['code ASC'],
  code_desc: ['code DESC'],
  salePrice_asc: ['salePrice ASC'],
  salePrice_desc: ['salePrice DESC'],
}

function buildWhere(search: string, filters: PropertyFiltersValues) {
  const conditions: Record<string, unknown>[] = []

  if (search) {
    conditions.push({
      or: [
        { title: { ilike: `%${search}%` } },
        { code: { ilike: `%${search}%` } },
        { description: { ilike: `%${search}%` } },
      ],
    })
  }
  if (filters.categoryId) conditions.push({ categoryId: filters.categoryId })
  if (filters.purpose) conditions.push({ purpose: filters.purpose })
  if (filters.status) conditions.push({ status: filters.status })
  if (filters.ownerId) conditions.push({ ownerId: filters.ownerId })
  if (filters.priceMin) conditions.push({ salePrice: { gte: Number(filters.priceMin) } })
  if (filters.priceMax) conditions.push({ salePrice: { lte: Number(filters.priceMax) } })
  if (filters.bedroomsMin) conditions.push({ bedrooms: { gte: Number(filters.bedroomsMin) } })
  if (filters.bedroomsMax) conditions.push({ bedrooms: { lte: Number(filters.bedroomsMax) } })
  if (filters.bathroomsMin) conditions.push({ bathrooms: { gte: Number(filters.bathroomsMin) } })
  if (filters.bathroomsMax) conditions.push({ bathrooms: { lte: Number(filters.bathroomsMax) } })
  if (filters.areaMin) conditions.push({ areaSqm: { gte: Number(filters.areaMin) } })
  if (filters.areaMax) conditions.push({ areaSqm: { lte: Number(filters.areaMax) } })

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
      include: [
        { relation: 'category' },
        { relation: 'address' },
        { relation: 'owner' },
        { relation: 'propertyPhotos', scope: { include: [{ relation: 'attachment' }] } },
      ],
      order: orderByMap[filters.orderBy],
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
