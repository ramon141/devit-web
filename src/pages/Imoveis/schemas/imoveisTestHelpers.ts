import i18n from '@/i18n'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

export const tImoveis = i18n.getFixedT('it', 'imoveis')

// Cadastro válido de venda; cada teste sobrescreve só o que quer provar
export const validValues: PropertyFormValues = {
  code: 'AP-100',
  title: 'Bilocale Vomero',
  categoryId: 'cat-1',
  ownerId: 'owner-1',
  responsibleBrokerId: '',
  purpose: 'sale',
  status: 'available',
  featured: false,
  featuredOrder: '',
  publishedOnSite: false,
  useInChatbot: false,
  salePrice: '300000',
  rentPrice: undefined,
  condoFee: undefined,
  bedrooms: '2',
  bathrooms: '1',
  parkingSpots: '',
  areaSqm: '',
  description: '',
  instagramUrl: '',
  tiktokUrl: '',
  country: 'IT',
  street: '',
  number: '',
  complement: '',
  neighborhoodId: '',
  city: 'Napoli',
  region: '',
  postalCode: '',
}

// Devolve as mensagens de erro por campo (vazio = aceito)
export function validate(overrides: Partial<PropertyFormValues>): Record<string, string> {
  const result = createPropertySchema(tImoveis).safeParse({ ...validValues, ...overrides })
  const errors: Record<string, string> = {}

  if (result.success) return errors

  for (const issue of result.error.issues) {
    const key = String(issue.path[0])

    if (!errors[key]) errors[key] = issue.message
  }

  return errors
}
