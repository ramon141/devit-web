import { z } from 'zod'
import type { TFunction } from 'i18next'
import { UserControllerCreateBodyAccessLevel } from '@/api/generated/models'
import { isStrongPassword } from '@/utils/isStrongPassword'

export function getAccessLevelOptions(t: TFunction<'amministrazione'>) {
  return [
    { value: UserControllerCreateBodyAccessLevel.admin, label: t('userSchema.accessLevelAdmin') },
    { value: UserControllerCreateBodyAccessLevel.broker, label: t('userSchema.accessLevelBroker') },
  ]
}

export function createUserSchema(t: TFunction<'amministrazione'>, isNewUser = false) {
  const strongPassword = (value?: string) => !value || isStrongPassword(value)
  const requiredPassword = z.string({ error: t('userForm.passwordRequired') }).min(1, t('userForm.passwordRequired'))
  const password = isNewUser
    ? requiredPassword.refine(strongPassword, t('userSchema.passwordMin'))
    : z.string().optional().refine(strongPassword, t('userSchema.passwordMin'))

  return z.object({
    fullName: z.string().min(2, t('userSchema.fullNameMin')),
    email: z.email(t('userSchema.emailInvalid')),
    accessLevel: z.enum(UserControllerCreateBodyAccessLevel, {
      error: t('userSchema.accessLevelRequired'),
    }),
    branchId: z.string().optional(),
    active: z.boolean(),
    password,
  })
}

export type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>
