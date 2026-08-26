import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { CommercialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'

type CommercialAreaFieldsProps = {
  form: UseFormReturn<CommercialFormValues>
}

function CommercialAreaFields({ form }: CommercialAreaFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.showcaseCountLabel')}>
        <Input {...register('showcaseCount')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.showcaseExposureLabel')}>
        <Input {...register('showcaseExposure')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.coveredAreaLabel')}>
        <Input {...register('coveredAreaSqm')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.uncoveredAreaLabel')}>
        <Input {...register('uncoveredAreaSqm')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.coverableAreaLabel')}>
        <Input {...register('coverableAreaSqm')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.roomSeparationLabel')}>
        <Input {...register('roomSeparation')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialAreaFields.contextLabel')}>
        <Input {...register('context')} />
      </FormFieldWrapper>

      <Controller control={control} name="manageable" render={({ field }) => (
        <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
          <Switch checked={field.value} onCheckedChange={field.onChange} />
          {t('scheda.commercialAreaFields.manageable')}
        </label>
      )} />
    </>
  )
}

export default CommercialAreaFields
