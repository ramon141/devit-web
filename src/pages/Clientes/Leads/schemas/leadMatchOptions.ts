import type { TFunction } from 'i18next'
import { LeadPropertyContactStatus } from '@/api/generated/models'

export function getLeadContactStatusOptions(t: TFunction<'clientes'>) {
  return Object.values(LeadPropertyContactStatus).map((status) => ({
    value: status,
    label: t(`leadContactStatusOptions.${status}`),
  }))
}

type ContactStatusValue = NonNullable<LeadPropertyContactStatus>

export function isLeadContactStatus(value: string): value is ContactStatusValue {
  return Object.values<string>(LeadPropertyContactStatus).includes(value)
}
