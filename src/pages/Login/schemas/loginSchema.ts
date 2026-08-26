import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createLoginSchema(t: TFunction<'login'>) {
  return z.object({
    email: z.string().min(1, t('loginSchema.emailRequired')).email(t('loginSchema.emailInvalid')),
    password: z.string().min(6, t('loginSchema.passwordMin')),
  })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
