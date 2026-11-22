import dayjs from 'dayjs'
import type { PropertyWithRelations } from '@/api/generated/models'

export const MEDIATION_ALERT_DAYS = 30

// Dias até o vencimento do contrato de intermediação; null se não vence dentro do prazo de alerta
export function getMediationDaysLeft(property: PropertyWithRelations): number | null {
  const expiresAt = property.propertyDetail?.mediationExpiresAt
  if (!expiresAt) return null

  const daysLeft = dayjs(expiresAt).startOf('day').diff(dayjs().startOf('day'), 'day')

  return daysLeft >= 0 && daysLeft <= MEDIATION_ALERT_DAYS ? daysLeft : null
}
