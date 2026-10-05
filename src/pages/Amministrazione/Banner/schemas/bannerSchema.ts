import { z } from 'zod'
import i18n from '@/i18n'

export const bannerSchema = z.object({
  title: z.string().min(2, i18n.t('amministrazione:bannerSchema.titleMin')),
  subtitle: z.string().optional(),
  // só http(s):// ou caminho interno começando com "/";
  // antes aceitava qualquer texto, incluindo "javascript:alert(1)" (XSS
  // armazenado se algo renderizar esse link como href)
  targetLink: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^(https?:\/\/|\/)/.test(value),
      i18n.t('amministrazione:bannerSchema.linkInvalid')
    ),
  // ordem de exibição não pode ser negativa
  displayOrder: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) >= 0),
      i18n.t('amministrazione:bannerSchema.orderInvalid')
    ),
  active: z.boolean(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>
