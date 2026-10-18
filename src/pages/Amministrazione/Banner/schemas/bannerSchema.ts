import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createBannerSchema(t: TFunction<'amministrazione'>) {
  return z.object({
    title: z.string().min(2, t('bannerSchema.titleMin')),
    subtitle: z.string().optional(),
    targetLink: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^(https?:\/\/|\/)/.test(value),
        t('bannerSchema.linkInvalid')
      ),
    displayOrder: z
      .string()
      .optional()
      .refine(
        (value) => !value || (/^\d+$/.test(value) && Number(value) >= 0),
        t('bannerSchema.orderInvalid')
      ),
    active: z.boolean(),
  })
}

export type BannerFormValues = z.infer<ReturnType<typeof createBannerSchema>>
