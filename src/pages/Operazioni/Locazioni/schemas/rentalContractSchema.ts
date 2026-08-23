import { z } from 'zod'
import { RentalContractSituation } from '@/api/generated/models'

export const rentalSituationOptions = [
  { value: RentalContractSituation.active, label: 'Attivo' },
  { value: RentalContractSituation.terminated, label: 'Rescisso' },
  { value: RentalContractSituation.closed, label: 'Chiuso' },
]

export const rentalContractSchema = z.object({
  number: z.string().min(1, 'Inserisci il numero'),
  propertyId: z.string().min(1, 'Seleziona un immobile'),
  tenantId: z.string().min(1, 'Seleziona un inquilino'),
  ownerId: z.string().min(1, 'Seleziona un proprietario'),
  startDate: z.string().min(1, 'Inserisci la data di inizio'),
  endDate: z.string().optional(),
  dueDay: z.string().min(1, 'Inserisci il giorno di scadenza'),
  rentAmount: z.string().min(1, 'Inserisci il valore dell’affitto'),
  condoFee: z.string().optional(),
  depositAmount: z.string().optional(),
  adjustmentIndex: z.string().optional(),
  situation: z.enum(RentalContractSituation, { error: 'Seleziona una situazione' }),
  noticeDays: z.string().optional(),
  notes: z.string().optional(),
})

export type RentalContractFormValues = z.infer<typeof rentalContractSchema>
