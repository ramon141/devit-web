import { z } from 'zod'
import { PropertyPurpose, PropertyStatus } from '@/api/generated/models'

export const purposeOptions = [
  { value: PropertyPurpose.sale, label: 'Vendita' },
  { value: PropertyPurpose.rent, label: 'Affitto' },
  { value: PropertyPurpose.rent_or_sale, label: 'Vendita e affitto' },
]

export const statusOptions = [
  { value: PropertyStatus.available, label: 'Disponibile' },
  { value: PropertyStatus.reserved, label: 'Riservato' },
  { value: PropertyStatus.rented, label: 'Affittato' },
  { value: PropertyStatus.sold, label: 'Venduto' },
  { value: PropertyStatus.under_maintenance, label: 'In manutenzione' },
  { value: PropertyStatus.unavailable, label: 'Non disponibile' },
]

export const propertySchema = z.object({
  code: z.string().min(1, 'Inserisci il codice'),
  title: z.string().min(3, 'Inserisci almeno 3 caratteri'),
  categoryId: z.string().min(1, 'Seleziona una categoria'),
  ownerId: z.string().min(1, 'Seleziona un proprietario'),
  purpose: z.enum(PropertyPurpose, { error: 'Seleziona una finalità' }),
  status: z.enum(PropertyStatus, { error: 'Seleziona uno stato' }),
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
  city: z.string().min(1, 'Inserisci la città'),
  region: z.string().optional(),
  postalCode: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
