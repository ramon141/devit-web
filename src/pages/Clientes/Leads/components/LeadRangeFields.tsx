import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

type RangeName = 'Budget' | 'AreaSqm' | 'Rooms' | 'Bedrooms' | 'Bathrooms' | 'Floor'

type LeadRangeFieldsProps = {
  form: UseFormReturn<LeadFormValues>
  name: RangeName
  label: string
  id?: string
  allowNegative?: boolean
}

// Par "da / a" de um critério de busca (prezzo, mq, locali, camere, bagni, piano)
function LeadRangeFields({ form, name, label, id, allowNegative }: LeadRangeFieldsProps) {
  const { t } = useTranslation('clientes')
  const { register, control } = form
  const { errors } = useFormState({ control })

  const minName = `min${name}` as const
  const maxName = `max${name}` as const
  const min = allowNegative ? undefined : 0

  return (
    <FormFieldWrapper id={id} label={label} error={errors[minName]?.message ?? errors[maxName]?.message}>
      <div className="flex items-center gap-2">
        <Input
          {...register(minName)}
          type="number"
          min={min}
          placeholder={t('leadFormFields.rangeFrom')}
        />

        <span className="text-sm text-muted-foreground">—</span>

        <Input
          {...register(maxName)}
          type="number"
          min={min}
          placeholder={t('leadFormFields.rangeTo')}
        />
      </div>
    </FormFieldWrapper>
  )
}

export default LeadRangeFields
