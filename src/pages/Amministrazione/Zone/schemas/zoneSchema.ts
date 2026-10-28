import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createZoneSchema(t: TFunction<'amministrazione'>) {
  return z.object({
    name: z.string().trim().min(2, t('zoneSchema.nameMin')).max(120, t('zoneSchema.nameMax')),
    city: z.string().trim().min(2, t('zoneSchema.cityMin')),
    region: z.string().optional(),
    active: z.boolean(),
  })
}

export type ZoneFormValues = z.infer<ReturnType<typeof createZoneSchema>>

export function createNeighborhoodSchema(t: TFunction<'amministrazione'>) {
  return z.object({
    name: z.string().trim().min(2, t('neighborhoodSchema.nameMin')).max(120, t('neighborhoodSchema.nameMax')),
    zoneId: z.string().min(1, t('neighborhoodSchema.zoneRequired')),
    active: z.boolean(),
  })
}

export type NeighborhoodFormValues = z.infer<ReturnType<typeof createNeighborhoodSchema>>
