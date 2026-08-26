import { z } from 'zod'
import type { TFunction } from 'i18next'
import { PropertyPurpose, PropertyStatus } from '@/api/generated/models'

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

export function createPropertySchema(t: TFunction<'imoveis'>) {
  return z.object({
    code: z.string().min(1, t('options.validation.code')),
    title: z.string().min(3, t('options.validation.title')),
    categoryId: z.string().min(1, t('options.validation.category')),
    ownerId: z.string().min(1, t('options.validation.owner')),
    purpose: z.enum(PropertyPurpose, { error: t('options.validation.purpose') }),
    status: z.enum(PropertyStatus, { error: t('options.validation.status') }),
    featured: z.boolean(),
    featuredOrder: z.string().optional(),
    active: z.boolean(),
    publishedOnSite: z.boolean(),

    salePrice: z.string().optional(),
    rentPrice: z.string().optional(),
    condoFee: z.string().optional(),

    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    parkingSpots: z.string().optional(),
    areaSqm: z.string().optional(),
    description: z.string().optional(),

    country: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().min(1, t('options.validation.city')),
    region: z.string().optional(),
    postalCode: z.string().optional(),
  })
}

export type PropertyFormValues = z.infer<ReturnType<typeof createPropertySchema>>
