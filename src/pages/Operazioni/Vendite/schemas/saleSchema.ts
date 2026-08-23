import { z } from 'zod'
import { SalePaymentMethod, SaleStatus } from '@/api/generated/models'

export const salePaymentMethodOptions = [
  { value: SalePaymentMethod.cash, label: 'Contanti' },
  { value: SalePaymentMethod.financed, label: 'Finanziato' },
  { value: SalePaymentMethod.direct_installments, label: 'Rate dirette' },
  { value: SalePaymentMethod.exchange, label: 'Permuta' },
  { value: SalePaymentMethod.other, label: 'Altro' },
]

export const saleStatusOptions = [
  { value: SaleStatus.negotiating, label: 'In trattativa' },
  { value: SaleStatus.sold, label: 'Venduta' },
  { value: SaleStatus.canceled, label: 'Annullata' },
]

export const saleSchema = z.object({
  number: z.string().min(1, 'Inserisci il numero'),
  propertyId: z.string().min(1, 'Seleziona un immobile'),
  buyerId: z.string().min(1, 'Seleziona un acquirente'),
  sellerId: z.string().min(1, 'Seleziona un venditore'),
  finalAmount: z.string().min(1, 'Inserisci il valore finale'),
  saleDate: z.string().min(1, 'Inserisci la data'),
  deedDate: z.string().optional(),
  paymentMethod: z.enum(SalePaymentMethod, { error: 'Seleziona una modalità' }),
  financialInstitution: z.string().optional(),
  downPayment: z.string().optional(),
  installmentsCount: z.string().optional(),
  commissionAmount: z.string().optional(),
  status: z.enum(SaleStatus, { error: 'Seleziona uno stato' }),
  cancellationReason: z.string().optional(),
  notes: z.string().optional(),
})

export type SaleFormValues = z.infer<typeof saleSchema>
