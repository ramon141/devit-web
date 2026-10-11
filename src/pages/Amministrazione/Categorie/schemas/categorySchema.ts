import { z } from 'zod'
import { PropertyCategoryKind } from '@/api/generated/models'
import i18n from '@/i18n'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const categorySchema = z.object({
  name: z.string().min(2, i18n.t('amministrazione:categorySchema.nameMin')),
  slug: z
    .string()
    .min(2, i18n.t('amministrazione:categorySchema.slugMin'))
    .regex(SLUG_REGEX, i18n.t('amministrazione:categorySchema.slugInvalid')),
  kind: z.union([z.enum(PropertyCategoryKind), z.literal('')]).optional(),
  icon: z.string().optional(),
  displayOrder: z
    .string()
    .refine(
      (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0),
      i18n.t('amministrazione:categorySchema.orderInvalid')
    )
    .optional(),
  active: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
