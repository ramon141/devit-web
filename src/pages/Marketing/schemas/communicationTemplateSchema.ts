import { z } from 'zod'
import type { TFunction } from 'i18next'
import { CommunicationTemplateChannel } from '@/api/generated/models/communicationTemplateChannel'
import { CommunicationTemplateCategory } from '@/api/generated/models/communicationTemplateCategory'

function isBlankHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').trim().length === 0
}

export function communicationTemplateSchema(t: TFunction<'marketing'>) {
  return z
    .object({
      name: z.string().min(1, t('templateSchema.nameRequired')),
      channel: z.string().min(1, t('templateSchema.channelRequired')),
      category: z.string().min(1, t('templateSchema.categoryRequired')),
      subject: z.string().optional(),
      body: z.string().min(1, t('templateSchema.bodyRequired')),
      design: z.string().nullable(),
      active: z.boolean(),
    })
    .superRefine((values, ctx) => {
      const isEmail = values.channel === CommunicationTemplateChannel.email

      if (isEmail && !values.subject?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['subject'],
          message: t('templateSchema.subjectRequiredForEmail'),
        })
      }

      if (isBlankHtml(values.body)) {
        ctx.addIssue({
          code: 'custom',
          path: ['body'],
          message: t('templateSchema.bodyRequired'),
        })
      }
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
