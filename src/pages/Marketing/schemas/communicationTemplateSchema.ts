import { z } from 'zod'
import type { TFunction } from 'i18next'
import { CommunicationTemplateChannel } from '@/api/generated/models/communicationTemplateChannel'
import { CommunicationTemplateCategory } from '@/api/generated/models/communicationTemplateCategory'

export function communicationTemplateSchema(t: TFunction<'marketing'>) {
  return z.object({
    name: z.string().min(1, t('templateSchema.nameRequired')),
    channel: z.string().min(1, t('templateSchema.channelRequired')),
    category: z.string().min(1, t('templateSchema.categoryRequired')),
    subject: z.string().optional(),
    body: z.string().min(1, t('templateSchema.bodyRequired')),
    active: z.boolean(),
  })
}

export type TemplateFormValues = z.infer<ReturnType<typeof communicationTemplateSchema>>

// Chaves derivadas dos enums gerados pelo orval — não podem divergir do backend.
export function getTemplateChannelOptions(t: TFunction<'marketing'>) {
  return Object.values(CommunicationTemplateChannel).map(value => ({
    value,
    label: t(`templateChannelOptions.${value}`),
  }))
}

export function getTemplateCategoryOptions(t: TFunction<'marketing'>) {
  return Object.values(CommunicationTemplateCategory).map(value => ({
    value,
    label: t(`templateCategoryOptions.${value}`),
  }))
}
