import { z } from 'zod'

export const branchSchema = z.object({
  name: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  active: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchSchema>
