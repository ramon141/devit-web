import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createBranchSchema(t: TFunction<'amministrazione'>) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t('branchSchema.nameMin')),
    active: z.boolean(),
  })
}

export type BranchFormValues = z.infer<ReturnType<typeof createBranchSchema>>
