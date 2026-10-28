import dayjs from 'dayjs'
import { z } from 'zod'
import type { TFunction } from 'i18next'
import { NewPersonRole } from '@/api/generated/models'
import { PHONE_REGEX } from '@/utils/phoneRegex'

export function getPersonRoleOptions(t: TFunction<'clientes'>) {
  return [
    { value: NewPersonRole.owner, label: t('personRoleOptions.owner') },
    { value: NewPersonRole.tenant, label: t('personRoleOptions.tenant') },
    { value: NewPersonRole.buyer, label: t('personRoleOptions.buyer') },
    { value: NewPersonRole.guarantor, label: t('personRoleOptions.guarantor') },
    { value: NewPersonRole.contact, label: t('personRoleOptions.contact') },
    { value: 'supplier', label: t('personRoleOptions.supplier') },
  ]
}

// Mesmo formato aceito pelo cadastro de imóveis e pela API
const POSTAL_CODE_REGEX = /^(\d{4,10})?$/

// Mesma faixa de datas plausíveis aceita pela API
const MIN_PLAUSIBLE_YEAR = 1900

const addressFields = [
  'street',
  'number',
  'complement',
  'neighborhoodId',
  'region',
  'postalCode',
  'country',
] as const

export function createPersonSchema(t: TFunction<'clientes'>) {
  return z
    .object({
      name: z.string().trim().min(2, t('personSchema.nameMin')),
      role: z.enum(NewPersonRole, { error: t('personSchema.roleRequired') }),
      email: z.email(t('personSchema.emailInvalid')).optional().or(z.literal('')),
      phone: z.string().regex(PHONE_REGEX, t('personSchema.phoneInvalid')).optional().or(z.literal('')),
      secondaryPhone: z
        .string()
        .regex(PHONE_REGEX, t('personSchema.phoneInvalid'))
        .optional()
        .or(z.literal('')),
      documentType: z.string().trim().optional(),
      documentNumber: z.string().trim().optional(),
      birthDate: z
        .string()
        .refine((value) => !value || !dayjs(value).isAfter(dayjs(), 'day'), t('personSchema.birthDateFuture'))
        .refine(
          (value) => !value || dayjs(value).year() >= MIN_PLAUSIBLE_YEAR,
          t('personSchema.birthDateImplausible', { year: MIN_PLAUSIBLE_YEAR })
        )
        .optional(),
      notes: z.string().optional(),
      active: z.boolean(),

      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhoodId: z.string().optional(),
      city: z.string().trim().optional(),
      region: z.string().optional(),
      postalCode: z
        .string()
        .regex(POSTAL_CODE_REGEX, t('personSchema.postalCodeInvalid'))
        .optional(),
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
