import { z } from 'zod'
import i18n from '@/i18n'

export const categorySchema = z.object({
  name: z.string().min(2, i18n.t('amministrazione:categorySchema.nameMin')),
  slug: z.string().min(2, i18n.t('amministrazione:categorySchema.slugMin')),
  icon: z.string().optional(),
  displayOrder: z.string().optional(),
  active: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
