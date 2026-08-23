import { z } from 'zod'
import { LeadStatus } from '@/api/generated/models'

export const leadStatusOptions = [
  { value: LeadStatus.new, label: 'Nuovo' },
  { value: LeadStatus.contacted, label: 'Contattato' },
  { value: LeadStatus.negotiating, label: 'In trattativa' },
  { value: LeadStatus.converted, label: 'Convertito' },
  { value: LeadStatus.lost, label: 'Perso' },
]

export const leadSchema = z.object({
  name: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  phone: z.string().optional(),
  email: z.email('E-mail non valida').optional().or(z.literal('')),
  firstContactAt: z.string().optional(),
  status: z.enum(LeadStatus, { error: 'Seleziona uno stato' }),
  lossReason: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
