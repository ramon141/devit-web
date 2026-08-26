import { z } from 'zod'
import { LeadSource, LeadStatus } from '@/api/generated/models'

export const leadStatusOptions = [
  { value: LeadStatus.new, label: 'Nuovo' },
  { value: LeadStatus.contacted, label: 'Contattato' },
  { value: LeadStatus.negotiating, label: 'In trattativa' },
  { value: LeadStatus.converted, label: 'Convertito' },
  { value: LeadStatus.lost, label: 'Perso' },
]

export const leadSourceOptions = [
  { value: LeadSource.portal, label: 'Portale' },
  { value: LeadSource.site, label: 'Sito' },
  { value: LeadSource.phone, label: 'Telefono' },
  { value: LeadSource.referral, label: 'Passaparola' },
  { value: LeadSource.social_media, label: 'Social media' },
  { value: LeadSource.walk_in, label: 'Visita spontanea' },
  { value: LeadSource.other, label: 'Altro' },
]

export const leadSchema = z.object({
  name: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  phone: z.string().optional(),
  email: z.email('E-mail non valida').optional().or(z.literal('')),
  firstContactAt: z.string().optional(),
  status: z.enum(LeadStatus, { error: 'Seleziona uno stato' }),
  source: z.enum(LeadSource).optional(),
  lossReason: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
