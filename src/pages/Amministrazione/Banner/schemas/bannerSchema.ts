import { z } from 'zod'
import i18n from '@/i18n'

export const bannerSchema = z.object({
  title: z.string().min(2, i18n.t('amministrazione:bannerSchema.titleMin')),
  subtitle: z.string().optional(),
  targetLink: z.string().optional(),
  displayOrder: z.string().optional(),
  active: z.boolean(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>
