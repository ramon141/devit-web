import { z } from 'zod'
import type { TFunction } from 'i18next'
import { PurchaseProposalPaymentMethod, PurchaseProposalStatus } from '@/api/generated/models'

export function getPaymentMethodOptions(t: TFunction<'proposte'>) {
  return [
    { value: PurchaseProposalPaymentMethod.cash, label: t('paymentMethodOptions.cash') },
    { value: PurchaseProposalPaymentMethod.financed, label: t('paymentMethodOptions.financed') },
    {
      value: PurchaseProposalPaymentMethod.direct_installments,
      label: t('paymentMethodOptions.directInstallments'),
    },
    { value: PurchaseProposalPaymentMethod.exchange, label: t('paymentMethodOptions.exchange') },
    { value: PurchaseProposalPaymentMethod.other, label: t('paymentMethodOptions.other') },
  ]
}

export function getProposalStatusOptions(t: TFunction<'proposte'>) {
  return [
    { value: PurchaseProposalStatus.received, label: t('statusOptions.received') },
    { value: PurchaseProposalStatus.negotiating, label: t('statusOptions.negotiating') },
    { value: PurchaseProposalStatus.accepted, label: t('statusOptions.accepted') },
    { value: PurchaseProposalStatus.rejected, label: t('statusOptions.rejected') },
  ]
}

export function createProposalSchema(t: TFunction<'proposte'>) {
  return z
    .object({
    number: z.string().min(1, t('schema.numberRequired')),
    propertyId: z.string().min(1, t('schema.propertyRequired')),
    buyerId: z.string().min(1, t('schema.buyerRequired')),
    proposalAmount: z.string().min(1, t('schema.amountRequired')),
    paymentMethod: z.enum(PurchaseProposalPaymentMethod, {
      error: t('schema.paymentMethodRequired'),
    }),
    paymentTerms: z.string().optional(),
    status: z.enum(PurchaseProposalStatus, { error: t('schema.statusRequired') }),
    financed: z.boolean(),
    proposalDate: z.string().min(1, t('schema.dateRequired')),
    validUntil: z.string().optional(),
    rejectionReason: z.string().optional(),
    notes: z.string().optional(),
    leadId: z.string().optional(),
    assignedToId: z.string().optional(),
    sellerAgentId: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const rejected = values.status === PurchaseProposalStatus.rejected
      const hasReason = (values.rejectionReason ?? '').trim().length > 0

      if (rejected && !hasReason) {
        ctx.addIssue({
          code: 'custom',
          path: ['rejectionReason'],
          message: t('schema.rejectionReasonRequired'),
        })
      }
    })
}

export type ProposalFormValues = z.infer<ReturnType<typeof createProposalSchema>>
