import { z } from 'zod'
import type { TFunction } from 'i18next'
import { SaleStatus } from '@/api/generated/models'

export function getSaleStatusOptions(t: TFunction) {
  return [
    { value: SaleStatus.negotiating, label: t('operazioni:vendite.schema.statusNegotiating') },
    { value: SaleStatus.sold, label: t('operazioni:vendite.schema.statusSold') },
    { value: SaleStatus.canceled, label: t('operazioni:vendite.schema.statusCanceled') },
  ]
}

export function createSaleSchema(t: TFunction) {
  return z
    .object({
    number: z.string().min(1, t('operazioni:vendite.schema.numberRequired')),
    propertyId: z.string().min(1, t('operazioni:vendite.schema.propertyRequired')),
    buyerId: z.string().min(1, t('operazioni:vendite.schema.buyerRequired')),
    sellerId: z.string().min(1, t('operazioni:vendite.schema.sellerRequired')),
    finalAmount: z
      .string()
      .min(1, t('operazioni:vendite.schema.finalAmountRequired'))
      .refine((value) => Number(value) > 0, t('operazioni:vendite.schema.finalAmountPositive')),
    saleDate: z.string().min(1, t('operazioni:vendite.schema.saleDateRequired')),
    deedDate: z.string().optional(),
    installmentsCount: z
      .string()
      .refine(
        (value) => !value || (Number.isInteger(Number(value)) && Number(value) > 0),
        t('operazioni:vendite.schema.installmentsInvalid'),
      )
      .optional(),
    commissionAmount: z
      .string()
      .refine((value) => !value || Number(value) >= 0, t('operazioni:vendite.schema.commissionInvalid'))
      .optional(),
    status: z.enum(SaleStatus, { error: t('operazioni:vendite.schema.statusRequired') }),
    cancellationReason: z.string().optional(),
    notes: z.string().optional(),
    proposalId: z.string().optional(),
    sellerAgentId: z.string().optional(),
    buyerAgentId: z.string().optional(),
    extraBuyerIds: z.array(z.string()).optional(),
    extraSellerIds: z.array(z.string()).optional(),
    })
    .superRefine((values, ctx) => {
      if (values.deedDate && values.saleDate && values.deedDate < values.saleDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['deedDate'],
          message: t('operazioni:vendite.schema.deedBeforeSale'),
        })
      }

      if (Number(values.commissionAmount) > Number(values.finalAmount)) {
        ctx.addIssue({
          code: 'custom',
          path: ['commissionAmount'],
          message: t('operazioni:vendite.schema.commissionAboveSale'),
        })
      }

      if (values.buyerId && values.buyerId === values.sellerId) {
        ctx.addIssue({
          code: 'custom',
          path: ['sellerId'],
          message: t('operazioni:vendite.schema.samePerson'),
        })
      }

      const canceled = values.status === SaleStatus.canceled

      if (canceled && !(values.cancellationReason ?? '').trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['cancellationReason'],
          message: t('operazioni:vendite.schema.cancellationReasonRequired'),
        })
      }
    })
}

export type SaleFormValues = z.infer<ReturnType<typeof createSaleSchema>>
