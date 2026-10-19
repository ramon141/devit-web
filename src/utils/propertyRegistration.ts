import type { TFunction } from 'i18next'
import type { PropertyWithRelations } from '@/api/generated/models'
import { formatDateTime } from '@/utils/formatDate'

// Autor do cadastro nunca é inventado: imóveis importados não têm corretor de cadastro.
export function registrationText(t: TFunction, property: PropertyWithRelations) {
  return t('registration.registeredBy', {
    date: formatDateTime(property.createdAt),
    author: property.createdBy?.fullName ?? t('registration.unknownOrigin'),
  })
}

export function lastChangeText(t: TFunction, property: PropertyWithRelations) {
  if (!property.lastChangedAt) return null

  return t('registration.lastChange', {
    date: formatDateTime(property.lastChangedAt),
    author: property.lastChangedBy?.fullName ?? t('registration.unknownOrigin'),
  })
}
