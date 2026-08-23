import { z } from 'zod'

export const bannerSchema = z.object({
  title: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  subtitle: z.string().optional(),
  targetLink: z.string().optional(),
  displayOrder: z.string().optional(),
  active: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>
