import { z } from 'zod'
import type { TFunction } from 'i18next'
import { RentalContractSituation } from '@/api/generated/models'

export function getRentalSituationOptions(t: TFunction) {
  return [
    { value: RentalContractSituation.active, label: t('operazioni:locazioni.schema.situationActive') },
    {
      value: RentalContractSituation.terminated,
      label: t('operazioni:locazioni.schema.situationTerminated'),
    },
    { value: RentalContractSituation.closed, label: t('operazioni:locazioni.schema.situationClosed') },
  ]
}

export function createRentalContractSchema(t: TFunction) {
  return z.object({
    number: z.string().min(1, t('operazioni:locazioni.schema.numberRequired')),
    propertyId: z.string().min(1, t('operazioni:locazioni.schema.propertyRequired')),
    tenantId: z.string().min(1, t('operazioni:locazioni.schema.tenantRequired')),
    ownerId: z.string().min(1, t('operazioni:locazioni.schema.ownerRequired')),
    startDate: z.string().min(1, t('operazioni:locazioni.schema.startDateRequired')),
    endDate: z.string().optional(),
    dueDay: z.string().min(1, t('operazioni:locazioni.schema.dueDayRequired')),
    rentAmount: z.string().min(1, t('operazioni:locazioni.schema.rentAmountRequired')),
    condoFee: z.string().optional(),
    depositAmount: z.string().optional(),
    adjustmentIndex: z.string().optional(),
    situation: z.enum(RentalContractSituation, {
      error: t('operazioni:locazioni.schema.situationRequired'),
    }),
    noticeDays: z.string().optional(),
    notes: z.string().optional(),
    registeredAt: z.string().optional(),
    renewalDueDate: z.string().optional(),
    ownerAgentId: z.string().optional(),
    tenantAgentId: z.string().optional(),
  })
}

export type RentalContractFormValues = z.infer<ReturnType<typeof createRentalContractSchema>>
