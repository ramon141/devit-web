import { z } from 'zod'
import type { TFunction } from 'i18next'
import { PropertyCategoryKind } from '@/api/generated/models'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_DISPLAY_ORDER = 32767

export function createCategorySchema(t: TFunction<'amministrazione'>) {
  return z.object({
    name: z.string().trim().min(2, t('categorySchema.nameMin')),
    slug: z
      .string()
      .min(2, t('categorySchema.slugMin'))
      .regex(SLUG_REGEX, t('categorySchema.slugInvalid')),
    kind: z.union([z.enum(PropertyCategoryKind), z.literal('')]).optional(),
    icon: z.string().optional(),
    displayOrder: z
      .string()
      .refine(
        (value) =>
          !value ||
          (Number.isInteger(Number(value)) &&
            Number(value) >= 0 &&
            Number(value) <= MAX_DISPLAY_ORDER),
        t('categorySchema.orderInvalid', { max: MAX_DISPLAY_ORDER })
      )
      .optional(),
    active: z.boolean(),
  })
}

export type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>
