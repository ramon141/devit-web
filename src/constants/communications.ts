import type { TFunction } from 'i18next'

export function getCommunicationStatusLabels(t: TFunction<'common'>): Record<string, string> {
  return {
    pending: t('communicationStatus.pending'),
    sent: t('communicationStatus.sent'),
    delivered: t('communicationStatus.delivered'),
    error: t('communicationStatus.error'),
    planned: t('communicationStatus.planned'),
    clicked: t('communicationStatus.clicked'),
    seen: t('communicationStatus.seen'),
  }
}

export function getCommunicationChannelLabels(t: TFunction<'common'>): Record<string, string> {
  return {
    email: t('communicationChannel.email'),
    whatsapp: t('communicationChannel.whatsapp'),
  }
}
