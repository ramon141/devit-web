import type { TFunction } from 'i18next'

import { NotificationType } from '@/api/generated/models/notificationType'
import type { Notification } from '@/api/generated/models'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

export const NOTIFICATION_POPOVER_LIMIT = 5

// Chaves derivadas do enum gerado pelo orval — não podem divergir do backend.
export function getNotificationTypeLabels(
  t: TFunction<'common'>,
): Record<string, string> {
  return Object.fromEntries(
    Object.values(NotificationType).map(type => [
      type,
      t(`notificationType.${type}`),
    ]),
  )
}

const NOTIFICATION_ENTITY_LEAD = 'Lead'

export const LEAD_ID_SEARCH_PARAM = 'leadId'

// Avisos ligados a uma richiesta abrem direto o cadastro dela
export function getNotificationLink(notification: Notification): string | null {
  if (notification.entityType !== NOTIFICATION_ENTITY_LEAD || !notification.entityId) return null

  return `${CRM_BASE_PATH}/clienti/richieste?${LEAD_ID_SEARCH_PARAM}=${notification.entityId}`
}
