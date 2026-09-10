import { z } from 'zod'
import type { TFunction } from 'i18next'
import { LeadRequestType, LeadSource, LeadStatus } from '@/api/generated/models'

export function getLeadStatusOptions(t: TFunction<'clientes'>) {
  return [
    { value: LeadStatus.new, label: t('leadStatusOptions.new') },
    { value: LeadStatus.contacted, label: t('leadStatusOptions.contacted') },
    { value: LeadStatus.negotiating, label: t('leadStatusOptions.negotiating') },
    { value: LeadStatus.converted, label: t('leadStatusOptions.converted') },
    { value: LeadStatus.lost, label: t('leadStatusOptions.lost') },
  ]
}

type LeadStatusColor = {
  dot: string
  border: string
}

// classes completas para o Tailwind detectar
export const leadStatusColors: Record<NonNullable<LeadStatus>, LeadStatusColor> = {
  new: { dot: 'bg-sky-500', border: 'border-l-sky-500' },
  contacted: { dot: 'bg-amber-500', border: 'border-l-amber-500' },
  negotiating: { dot: 'bg-violet-500', border: 'border-l-violet-500' },
  converted: { dot: 'bg-emerald-500', border: 'border-l-emerald-500' },
  lost: { dot: 'bg-red-500', border: 'border-l-red-500' },
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

export function getLeadRequestTypeOptions(t: TFunction<'clientes'>) {
  return [
    { value: LeadRequestType.search, label: t('leadRequestTypeOptions.search') },
    { value: LeadRequestType.valuation, label: t('leadRequestTypeOptions.valuation') },
    { value: LeadRequestType.contact, label: t('leadRequestTypeOptions.contact') },
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
    requestType: z.enum(LeadRequestType).optional(),
    desiredCity: z.string().optional(),
    maxBudget: z.string().optional(),
    subject: z.string().optional(),
    lossReason: z.string().optional(),
    notes: z.string().optional(),
    assignedToId: z.string().optional(),
  })
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadSchema>>
