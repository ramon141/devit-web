import { z } from 'zod'
import i18n from '@/i18n'

export const branchSchema = z.object({
  name: z.string().min(2, i18n.t('amministrazione:branchSchema.nameMin')),
  active: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchSchema>
