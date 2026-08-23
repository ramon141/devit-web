import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  slug: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  icon: z.string().optional(),
  displayOrder: z.string().optional(),
  active: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
