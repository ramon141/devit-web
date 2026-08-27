import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createForgotPasswordSchema(t: TFunction<'login'>) {
  return z.object({
    email: z.string().min(1, t('loginSchema.emailRequired')).email(t('loginSchema.emailInvalid')),
  })
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>
