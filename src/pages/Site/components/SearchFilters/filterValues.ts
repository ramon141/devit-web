import type { PublicPropertyControllerFindParams } from '@/api/generated/models'
import { DEFAULT_SORT, SORT_KEYS, type SortKey } from '@/lib/site/types'

// Campos do formulário; na URL usam estes nomes e são traduzidos para a API em toFindParams
export type FilterValues = {
  contract: string
  zone: string
  category: string
  priceMin: string
  priceMax: string
  surfaceMin: string
  bedroomsMin: string
  q: string
}

export const PAGE_LIMIT = 12

export function readFilters(params: URLSearchParams): FilterValues {
  return {
    contract: params.get('contract') ?? '',
    zone: params.get('zone') ?? '',
    category: params.get('category') ?? '',
    priceMin: params.get('priceMin') ?? '',
    priceMax: params.get('priceMax') ?? '',
    surfaceMin: params.get('surfaceMin') ?? '',
    bedroomsMin: params.get('bedroomsMin') ?? '',
    q: params.get('q') ?? '',
  }
}

export const EMPTY_FILTERS = readFilters(new URLSearchParams())

export function toSearchString(values: Partial<FilterValues>, extra: Record<string, string> = {}) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries({ ...values, ...extra })) {
    if (value) params.set(key, value)
  }

  return params.toString()
}

function positiveNumber(value: string | null) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function asSort(value: string | null): SortKey {
  return SORT_KEYS.find((item) => item === value) ?? DEFAULT_SORT
}

export function readSort(params: URLSearchParams): SortKey {
  return asSort(params.get('sort'))
}

export function toFindParams(
  params: URLSearchParams,
  limit = PAGE_LIMIT
): PublicPropertyControllerFindParams {
  const filters = readFilters(params)

  return {
    purpose: filters.contract || undefined,
    zone: filters.zone || undefined,
    categorySlug: filters.category ? [filters.category] : undefined,
    minPrice: positiveNumber(filters.priceMin),
    maxPrice: positiveNumber(filters.priceMax),
    minArea: positiveNumber(filters.surfaceMin),
    bedrooms: positiveNumber(filters.bedroomsMin),
    keyword: filters.q || undefined,
    sort: readSort(params),
    page: positiveNumber(params.get('page')) ?? 1,
    limit,
  }
}
