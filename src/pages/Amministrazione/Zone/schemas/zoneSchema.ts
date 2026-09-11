import { z } from 'zod'
import i18n from '@/i18n'

export const zoneSchema = z.object({
  name: z.string().min(2, i18n.t('amministrazione:zoneSchema.nameMin')),
  city: z.string().min(2, i18n.t('amministrazione:zoneSchema.cityMin')),
  region: z.string().optional(),
  active: z.boolean(),
})

export type ZoneFormValues = z.infer<typeof zoneSchema>

export const neighborhoodSchema = z.object({
  name: z.string().min(2, i18n.t('amministrazione:neighborhoodSchema.nameMin')),
  zoneId: z.string().min(1, i18n.t('amministrazione:neighborhoodSchema.zoneRequired')),
  active: z.boolean(),
})

export type NeighborhoodFormValues = z.infer<typeof neighborhoodSchema>
