import { z } from 'zod'
import type { TFunction } from 'i18next'
import { NewClientFeedbackType } from '@/api/generated/models'

export function getFeedbackTypeOptions(t: TFunction<'clientes'>) {
  return Object.values(NewClientFeedbackType).map((value) => ({
    value,
    label: t(`feedbackTypeOptions.${value}`),
  }))
}

export function createFeedbackSchema(t: TFunction<'clientes'>) {
  return z.object({
    type: z.enum(NewClientFeedbackType, { error: t('feedbackSchema.typeRequired') }),
    content: z.string().trim().min(1, t('feedbackSchema.contentRequired')),
    personId: z.string().min(1, t('feedbackSchema.personRequired')),
    propertyId: z.string().optional(),
    leadId: z.string().optional(),
  })
}

export type FeedbackFormValues = z.infer<ReturnType<typeof createFeedbackSchema>>
