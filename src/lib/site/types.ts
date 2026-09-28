import type {
  BranchWithRelations,
  PublicPropertyControllerFind200ItemsItem,
  PublicPropertyControllerFindById200,
  PublicPropertyMapControllerFind200Item,
  PublicZoneControllerFind200Item,
} from '@/api/generated/models'

export const LOCALES = ['it', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

/** Texto que existe em vários idiomas. O italiano é obrigatório. */
export type Localized<T> = { it: T } & Partial<Record<Exclude<Locale, 'it'>, T>>

// Dados públicos vindos da API (/public/*)
export type SiteCard = PublicPropertyControllerFind200ItemsItem
export type SiteDetail = PublicPropertyControllerFindById200
export type SiteZone = PublicZoneControllerFind200Item
export type SiteMapPin = PublicPropertyMapControllerFind200Item
export type SiteBranch = BranchWithRelations

export type Purpose = 'sale' | 'rent'

export const SORT_KEYS = ['featured', 'date-desc', 'price-asc', 'price-desc'] as const
export type SortKey = (typeof SORT_KEYS)[number]
export const DEFAULT_SORT: SortKey = 'featured'

export type SitePhoto = {
  url: string
  caption?: string | null
}

export type Agent = {
  id: string
  name: string
  role: Localized<string>
}
