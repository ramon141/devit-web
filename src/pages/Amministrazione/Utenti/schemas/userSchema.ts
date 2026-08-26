import { z } from 'zod'
import { UserControllerCreateBodyAccessLevel } from '@/api/generated/models'
import i18n from '@/i18n'

export const accessLevelOptions = [
  { value: UserControllerCreateBodyAccessLevel.admin, label: i18n.t('amministrazione:userSchema.accessLevelAdmin') },
  { value: UserControllerCreateBodyAccessLevel.broker, label: i18n.t('amministrazione:userSchema.accessLevelBroker') },
]

export const userSchema = z.object({
  fullName: z.string().min(2, i18n.t('amministrazione:userSchema.fullNameMin')),
  email: z.email(i18n.t('amministrazione:userSchema.emailInvalid')),
  accessLevel: z.enum(UserControllerCreateBodyAccessLevel, {
    error: i18n.t('amministrazione:userSchema.accessLevelRequired'),
  }),
  branchId: z.string().optional(),
  active: z.boolean(),
  password: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length >= 6,
      i18n.t('amministrazione:userSchema.passwordMin')
    ),
})

export type UserFormValues = z.infer<typeof userSchema>
