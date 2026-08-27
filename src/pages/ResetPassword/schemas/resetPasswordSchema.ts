import { z } from 'zod'
import type { TFunction } from 'i18next'

const UPPERCASE_REGEX = /[A-Z]/
const LOWERCASE_REGEX = /[a-z]/
const NUMBER_REGEX = /[0-9]/
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/

export function createResetPasswordSchema(t: TFunction<'login'>) {
  return z
    .object({
      password: z
        .string()
        .min(8, t('resetPasswordSchema.passwordMin'))
        .regex(UPPERCASE_REGEX, t('resetPasswordSchema.passwordUppercase'))
        .regex(LOWERCASE_REGEX, t('resetPasswordSchema.passwordLowercase'))
        .regex(NUMBER_REGEX, t('resetPasswordSchema.passwordNumber'))
        .regex(SPECIAL_CHAR_REGEX, t('resetPasswordSchema.passwordSpecialChar')),
      confirmPassword: z.string().min(1, t('resetPasswordSchema.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('resetPasswordSchema.passwordsDontMatch'),
      path: ['confirmPassword'],
    })
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>
