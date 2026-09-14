import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

type RangeName = 'Budget' | 'AreaSqm' | 'Rooms' | 'Bedrooms' | 'Bathrooms'

type LeadRangeFieldsProps = {
  form: UseFormReturn<LeadFormValues>
  name: RangeName
  label: string
  id?: string
}

// Par "da / a" de um critério de busca (prezzo, mq, locali, camere, bagni)
function LeadRangeFields({ form, name, label, id }: LeadRangeFieldsProps) {
  const { t } = useTranslation('clientes')
  const { register, control } = form
  const { errors } = useFormState({ control })

  const minName = `min${name}` as const
  const maxName = `max${name}` as const

  return (
    <FormFieldWrapper id={id} label={label} error={errors[minName]?.message ?? errors[maxName]?.message}>
      <div className="flex items-center gap-2">
        <Input
          {...register(minName)}
          type="number"
          min={0}
          placeholder={t('leadFormFields.rangeFrom')}
        />

        <span className="text-sm text-muted-foreground">—</span>

        <Input
          {...register(maxName)}
          type="number"
          min={0}
          placeholder={t('leadFormFields.rangeTo')}
        />
      </div>
    </FormFieldWrapper>
  )
}

export default LeadRangeFields
