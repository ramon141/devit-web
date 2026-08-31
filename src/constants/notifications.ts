import type { TFunction } from 'i18next'

import { NotificationType } from '@/api/generated/models/notificationType'

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
