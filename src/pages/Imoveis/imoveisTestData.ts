import type { Property, PropertyWithRelations } from '@/api/generated/models'

// Imóvel mínimo e determinístico (sem faker) para os testes da área de imóveis
export function makeProperty(overrides: Partial<PropertyWithRelations> = {}): PropertyWithRelations {
  return {
    id: 'prop-1',
    code: 'AP-100',
    title: 'Bilocale Vomero',
    purpose: 'sale',
    status: 'available',
    categoryId: 'cat-1',
    addressId: 'addr-1',
    ownerId: 'owner-1',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
    salePrice: 300000,
    ...overrides,
  }
}

export function makeCreated(id: string): Property {
  return {
    id,
    code: 'AP-100-COPIA',
    title: 'copia',
    purpose: 'sale',
    categoryId: 'cat-1',
    addressId: 'addr-1',
    ownerId: 'owner-1',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  }
}
