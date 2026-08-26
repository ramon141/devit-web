import { z } from 'zod'
import { PurchaseProposalPaymentMethod, PurchaseProposalStatus } from '@/api/generated/models'

export const paymentMethodOptions = [
  { value: PurchaseProposalPaymentMethod.cash, label: 'Contanti' },
  { value: PurchaseProposalPaymentMethod.financed, label: 'Finanziato' },
  { value: PurchaseProposalPaymentMethod.direct_installments, label: 'Rate dirette' },
  { value: PurchaseProposalPaymentMethod.exchange, label: 'Permuta' },
  { value: PurchaseProposalPaymentMethod.other, label: 'Altro' },
]

export const proposalStatusOptions = [
  { value: PurchaseProposalStatus.received, label: 'Ricevuta' },
  { value: PurchaseProposalStatus.negotiating, label: 'In trattativa' },
  { value: PurchaseProposalStatus.accepted, label: 'Accettata' },
  { value: PurchaseProposalStatus.rejected, label: 'Rifiutata' },
]

export const proposalSchema = z.object({
  number: z.string().min(1, 'Inserisci il numero'),
  propertyId: z.string().min(1, 'Seleziona un immobile'),
  buyerId: z.string().min(1, 'Seleziona un acquirente'),
  proposalAmount: z.string().min(1, 'Inserisci il valore della proposta'),
  paymentMethod: z.enum(PurchaseProposalPaymentMethod, { error: 'Seleziona una modalità' }),
  paymentTerms: z.string().optional(),
  status: z.enum(PurchaseProposalStatus, { error: 'Seleziona uno stato' }),
  financed: z.boolean(),
  proposalDate: z.string().min(1, 'Inserisci la data'),
  validUntil: z.string().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
  leadId: z.string().optional(),
  assignedToId: z.string().optional(),
  sellerAgentId: z.string().optional(),
})

export type ProposalFormValues = z.infer<typeof proposalSchema>
