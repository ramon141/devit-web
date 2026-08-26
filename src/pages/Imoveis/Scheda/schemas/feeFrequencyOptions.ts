import type { TFunction } from 'i18next'
import { NewPropertyFeeFrequency } from '@/api/generated/models'

export function getFeeFrequencyOptions(t: TFunction<'imoveis'>) {
  return [
    { value: NewPropertyFeeFrequency.once, label: t('options.feeFrequency.once') },
    { value: NewPropertyFeeFrequency.monthly, label: t('options.feeFrequency.monthly') },
    { value: NewPropertyFeeFrequency.yearly, label: t('options.feeFrequency.yearly') },
  ]
}
