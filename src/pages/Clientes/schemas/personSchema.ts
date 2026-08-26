import { z } from 'zod'
import type { TFunction } from 'i18next'
import { NewPersonRole } from '@/api/generated/models'

export function getPersonRoleOptions(t: TFunction<'clientes'>) {
  return [
    { value: NewPersonRole.owner, label: t('personRoleOptions.owner') },
    { value: NewPersonRole.tenant, label: t('personRoleOptions.tenant') },
    { value: NewPersonRole.buyer, label: t('personRoleOptions.buyer') },
    { value: NewPersonRole.guarantor, label: t('personRoleOptions.guarantor') },
    { value: NewPersonRole.contact, label: t('personRoleOptions.contact') },
  ]
}

const addressFields = [
  'street',
  'number',
  'complement',
  'neighborhood',
  'region',
  'postalCode',
  'country',
] as const

export function createPersonSchema(t: TFunction<'clientes'>) {
  return z
    .object({
      name: z.string().min(2, t('personSchema.nameMin')),
      role: z.enum(NewPersonRole, { error: t('personSchema.roleRequired') }),
      email: z.email(t('personSchema.emailInvalid')).optional().or(z.literal('')),
      phone: z.string().optional(),
      secondaryPhone: z.string().optional(),
      documentType: z.string().optional(),
      documentNumber: z.string().optional(),
      birthDate: z.string().optional(),
      notes: z.string().optional(),
      active: z.boolean(),

      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const hasOtherAddressData = addressFields.some((field) => values[field])

      if (hasOtherAddressData && !values.city) {
        ctx.addIssue({
          code: 'custom',
          path: ['city'],
          message: t('personSchema.cityRequired'),
        })
      }
    })
}

export type PersonFormValues = z.infer<ReturnType<typeof createPersonSchema>>
