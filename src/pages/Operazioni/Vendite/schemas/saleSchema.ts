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
  return z.object({
    number: z.string().min(1, t('operazioni:vendite.schema.numberRequired')),
    propertyId: z.string().min(1, t('operazioni:vendite.schema.propertyRequired')),
    buyerId: z.string().min(1, t('operazioni:vendite.schema.buyerRequired')),
    sellerId: z.string().min(1, t('operazioni:vendite.schema.sellerRequired')),
    finalAmount: z.string().min(1, t('operazioni:vendite.schema.finalAmountRequired')),
    saleDate: z.string().min(1, t('operazioni:vendite.schema.saleDateRequired')),
    deedDate: z.string().optional(),
    installmentsCount: z.string().optional(),
    commissionAmount: z.string().optional(),
    status: z.enum(SaleStatus, { error: t('operazioni:vendite.schema.statusRequired') }),
    cancellationReason: z.string().optional(),
    notes: z.string().optional(),
    proposalId: z.string().optional(),
    sellerAgentId: z.string().optional(),
    buyerAgentId: z.string().optional(),
    extraBuyerIds: z.array(z.string()).optional(),
    extraSellerIds: z.array(z.string()).optional(),
  })
}

export type SaleFormValues = z.infer<ReturnType<typeof createSaleSchema>>
