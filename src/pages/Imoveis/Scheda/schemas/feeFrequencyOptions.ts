import { NewPropertyFeeFrequency } from '@/api/generated/models'

export const feeFrequencyOptions = [
  { value: NewPropertyFeeFrequency.once, label: 'Una tantum' },
  { value: NewPropertyFeeFrequency.monthly, label: 'Mensile' },
  { value: NewPropertyFeeFrequency.yearly, label: 'Annuale' },
]
