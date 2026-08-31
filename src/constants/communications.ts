import type { TFunction } from 'i18next'

import { CommunicationLogChannel } from '@/api/generated/models/communicationLogChannel'
import { CommunicationLogStatus } from '@/api/generated/models/communicationLogStatus'

// Chaves derivadas dos enums gerados pelo orval — não podem divergir do backend.

export function getCommunicationStatusLabels(
  t: TFunction<'common'>,
): Record<string, string> {
  return Object.fromEntries(
    Object.values(CommunicationLogStatus).map(status => [
      status,
      t(`communicationStatus.${status}`),
    ]),
  )
}

export function getCommunicationChannelLabels(
  t: TFunction<'common'>,
): Record<string, string> {
  return Object.fromEntries(
    Object.values(CommunicationLogChannel).map(channel => [
      channel,
      t(`communicationChannel.${channel}`),
    ]),
  )
}
