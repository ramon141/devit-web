import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createContattiSchema(t: TFunction<'site'>) {
  return z.object({
    name: z.string().min(2, t('contattiSchema.nameMin')),
    email: z.string().email(t('contattiSchema.emailInvalid')),
    phone: z.string().min(6, t('contattiSchema.phoneMin')),
    subject: z.string().optional(),
    message: z.string().min(5, t('contattiSchema.messageMin')),
    acceptPrivacy: z.boolean().refine((value) => value, {
      message: t('contattiSchema.acceptPrivacy'),
    }),
  })
}

export type ContattiFormValues = z.infer<ReturnType<typeof createContattiSchema>>
