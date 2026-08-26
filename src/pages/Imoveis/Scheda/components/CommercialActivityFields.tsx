import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { CommercialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'

type CommercialActivityFieldsProps = {
  form: UseFormReturn<CommercialFormValues>
}

function CommercialActivityFields({ form }: CommercialActivityFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form

  const scopeOptions = [
    { value: 'property', label: t('scheda.commercialActivityFields.scopeOptions.property') },
    { value: 'activity', label: t('scheda.commercialActivityFields.scopeOptions.activity') },
    { value: 'property_and_activity', label: t('scheda.commercialActivityFields.scopeOptions.propertyAndActivity') },
  ]

  return (
    <>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.scopeLabel')}>
        <Controller control={control} name="scope" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={scopeOptions}
            placeholder={t('scheda.commercialActivityFields.scopePlaceholder')}
          />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.mainActivityLabel')}>
        <Input {...register('mainActivity')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.alternativeActivitiesLabel')}>
        <Input {...register('alternativeActivities')} placeholder={t('scheda.commercialActivityFields.alternativeActivitiesPlaceholder')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.activityValueLabel')}>
        <Input {...register('activityValue')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.averageRevenueFromLabel')}>
        <Input {...register('averageRevenueFrom')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.averageRevenueToLabel')}>
        <Input {...register('averageRevenueTo')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.monthlyRentLabel')}>
        <Input {...register('monthlyRent')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.commercialActivityFields.weeklyRestDayLabel')}>
        <Input {...register('weeklyRestDay')} />
      </FormFieldWrapper>
    </>
  )
}

export default CommercialActivityFields
