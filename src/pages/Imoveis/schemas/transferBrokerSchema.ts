import { z } from 'zod'
import type { TFunction } from 'i18next'

const MIN_REASON_LENGTH = 3
const MAX_REASON_LENGTH = 500

export function createTransferBrokerSchema(t: TFunction<'imoveis'>) {
  return z.object({
    newBrokerId: z.string().min(1, t('broker.transfer.newBrokerRequired')),
    reason: z
      .string()
      .trim()
      .min(MIN_REASON_LENGTH, t('broker.transfer.reasonRequired'))
      .max(MAX_REASON_LENGTH, t('broker.transfer.reasonRequired')),
  })
}

export type TransferBrokerFormValues = z.infer<ReturnType<typeof createTransferBrokerSchema>>
