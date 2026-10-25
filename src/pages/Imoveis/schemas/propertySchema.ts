import { z } from 'zod'
import type { TFunction } from 'i18next'
import { PropertyPurpose, PropertyStatus } from '@/api/generated/models'
import type { PropertyCategoryKind } from '@/pages/Imoveis/hooks/useCategoryKinds'

export function getCategoryKindOptions(t: TFunction<'imoveis'>): { value: PropertyCategoryKind; label: string }[] {
  return [
    { value: 'residential', label: t('categoryKind.residential') },
    { value: 'commercial', label: t('categoryKind.commercial') },
    { value: 'industrial', label: t('categoryKind.industrial') },
    { value: 'land', label: t('categoryKind.land') },
    { value: 'attachment', label: t('categoryKind.attachment') },
    { value: 'construction_site', label: t('categoryKind.constructionSite') },
  ]
}

export function getPurposeOptions(t: TFunction<'imoveis'>) {
  return [
    { value: PropertyPurpose.sale, label: t('options.purpose.sale') },
    { value: PropertyPurpose.rent, label: t('options.purpose.rent') },
    { value: PropertyPurpose.rent_or_sale, label: t('options.purpose.rentOrSale') },
  ]
}

export function getStatusOptions(t: TFunction<'imoveis'>) {
  return [
    { value: PropertyStatus.available, label: t('options.status.available') },
    { value: PropertyStatus.reserved, label: t('options.status.reserved') },
    { value: PropertyStatus.rented, label: t('options.status.rented') },
    { value: PropertyStatus.sold, label: t('options.status.sold') },
    { value: PropertyStatus.under_maintenance, label: t('options.status.underMaintenance') },
    { value: PropertyStatus.unavailable, label: t('options.status.unavailable') },
  ]
}

// Rótulos abreviados, para espaços apertados (ex: cards do painel)
export function getShortStatusOptions(t: TFunction<'imoveis'>) {
  return [
    { value: PropertyStatus.available, label: t('options.statusShort.available') },
    { value: PropertyStatus.reserved, label: t('options.statusShort.reserved') },
    { value: PropertyStatus.rented, label: t('options.statusShort.rented') },
    { value: PropertyStatus.sold, label: t('options.statusShort.sold') },
    { value: PropertyStatus.under_maintenance, label: t('options.statusShort.underMaintenance') },
    { value: PropertyStatus.unavailable, label: t('options.statusShort.unavailable') },
  ]
}

export function nonNegativeNumber(t: TFunction<'imoveis'>) {
  return z
    .string()
    .refine(
      (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
      t('options.validation.nonNegativeNumber'),
    )
    .optional()
}

export function percentRange(t: TFunction<'imoveis'>) {
  return z
    .string()
    .refine(
      (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100),
      t('options.validation.percentRange'),
    )
    .optional()
}

const SMALLINT_MAX = 32767
const MAX_ROOM_COUNT = 50

function nonNegativeSmallint(t: TFunction<'imoveis'>, max = SMALLINT_MAX) {
  return z
    .string()
    .refine(
      (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
      t('options.validation.nonNegativeNumber'),
    )
    .refine(
      (value) => !value || Number(value) <= max,
      max === SMALLINT_MAX ? t('options.validation.maxSmallint') : t('options.validation.maxCount', { max }),
    )
    .optional()
}

const SOCIAL_URL_MAX_LENGTH = 500

// Link opcional: vazio é aceito; preenchido precisa ser http(s) de um host do domínio informado
function socialUrl(domain: string, message: string) {
  return z
    .string()
    .refine((value) => {
      const trimmed = value.trim()
      if (!trimmed) return true
      if (trimmed.length > SOCIAL_URL_MAX_LENGTH) return false

      try {
        const url = new URL(trimmed)
        const host = url.hostname.toLowerCase()
        const isHttp = url.protocol === 'http:' || url.protocol === 'https:'

        return isHttp && (host === domain || host.endsWith(`.${domain}`))
      } catch {
        return false
      }
    }, message)
    .optional()
}

export function createPropertySchema(t: TFunction<'imoveis'>) {
  const schema = z.object({
    code: z.string().min(1, t('options.validation.code')),
    title: z.string().min(3, t('options.validation.title')),
    categoryId: z.string().min(1, t('options.validation.category')),
    ownerId: z.string().min(1, t('options.validation.owner')),
    responsibleBrokerId: z.string().optional(),
    purpose: z.enum(PropertyPurpose, { error: t('options.validation.purpose') }),
    status: z.enum(PropertyStatus, { error: t('options.validation.status') }),
    featured: z.boolean(),
    featuredOrder: z.string().optional(),
    publishedOnSite: z.boolean(),
    useInChatbot: z.boolean(),

    salePrice: z.string().optional(),
    rentPrice: z.string().optional(),
    condoFee: z.string().optional(),

    bedrooms: nonNegativeSmallint(t, MAX_ROOM_COUNT),
    bathrooms: nonNegativeSmallint(t, MAX_ROOM_COUNT),
    parkingSpots: nonNegativeNumber(t),
    areaSqm: nonNegativeNumber(t),
    description: z.string().optional(),
    instagramUrl: socialUrl('instagram.com', t('options.validation.instagramUrl')),
    tiktokUrl: socialUrl('tiktok.com', t('options.validation.tiktokUrl')),

    country: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhoodId: z.string().optional(),
    city: z.string().min(1, t('options.validation.city')),
    region: z.string().optional(),
    postalCode: z
      .string()
      .regex(/^(\d{4,10})?$/, t('options.validation.postalCode'))
      .optional(),
  })

  // Mesmas regras de preço x finalidade da API; o erro aparece no campo de preço
  return schema.superRefine((values, ctx) => {
    const isSaleOnly = values.purpose === PropertyPurpose.sale
    const isRentOnly = values.purpose === PropertyPurpose.rent
    const addPriceIssue = (field: 'salePrice' | 'rentPrice', key: string) =>
      ctx.addIssue({ code: 'custom', path: [field], message: t(`options.validation.${key}`) })

    if (!isRentOnly && !values.salePrice) addPriceIssue('salePrice', 'salePriceRequired')
    if (isRentOnly && values.salePrice) addPriceIssue('salePrice', 'salePriceNotAllowed')
    if (isSaleOnly && values.rentPrice) addPriceIssue('rentPrice', 'rentPriceNotAllowed')
  })
}

export type PropertyFormValues = z.infer<ReturnType<typeof createPropertySchema>>
