import { z } from 'zod'
import type { TFunction } from 'i18next'
import { LeadSource, LeadStatus } from '@/api/generated/models'

export function getLeadStatusOptions(t: TFunction<'clientes'>) {
  return [
    { value: LeadStatus.new, label: t('leadStatusOptions.new') },
    { value: LeadStatus.contacted, label: t('leadStatusOptions.contacted') },
    { value: LeadStatus.negotiating, label: t('leadStatusOptions.negotiating') },
    { value: LeadStatus.converted, label: t('leadStatusOptions.converted') },
    { value: LeadStatus.lost, label: t('leadStatusOptions.lost') },
  ]
}

export function getLeadSourceOptions(t: TFunction<'clientes'>) {
  return [
    { value: LeadSource.portal, label: t('leadSourceOptions.portal') },
    { value: LeadSource.site, label: t('leadSourceOptions.site') },
    { value: LeadSource.phone, label: t('leadSourceOptions.phone') },
    { value: LeadSource.referral, label: t('leadSourceOptions.referral') },
    { value: LeadSource.social_media, label: t('leadSourceOptions.socialMedia') },
    { value: LeadSource.walk_in, label: t('leadSourceOptions.walkIn') },
    { value: LeadSource.other, label: t('leadSourceOptions.other') },
  ]
}

export function createLeadSchema(t: TFunction<'clientes'>) {
  return z.object({
    name: z.string().min(2, t('leadSchema.nameMin')),
    phone: z.string().optional(),
    email: z.email(t('leadSchema.emailInvalid')).optional().or(z.literal('')),
    firstContactAt: z.string().optional(),
    status: z.enum(LeadStatus, { error: t('leadSchema.statusRequired') }),
    source: z.enum(LeadSource).optional(),
    lossReason: z.string().optional(),
    notes: z.string().optional(),
    assignedToId: z.string().optional(),
  })
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadSchema>>
