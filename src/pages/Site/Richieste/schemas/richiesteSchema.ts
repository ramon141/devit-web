import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createRichiesteSchema(t: TFunction<'site'>) {
  return z.object({
    requestType: z.enum(['search', 'valuation']),
    desiredCity: z.string().min(2, t('richiesteSchema.desiredCityMin')),
    maxBudget: z.string().optional(),
    name: z.string().min(2, t('richiesteSchema.nameMin')),
    email: z.string().email(t('richiesteSchema.emailInvalid')),
    phone: z.string().min(6, t('richiesteSchema.phoneMin')),
    message: z.string().min(5, t('richiesteSchema.messageMin')),
    acceptTerms: z.boolean().refine((value) => value, {
      message: t('richiesteSchema.acceptTerms'),
    }),
  })
}

export type RichiesteFormValues = z.infer<ReturnType<typeof createRichiesteSchema>>
