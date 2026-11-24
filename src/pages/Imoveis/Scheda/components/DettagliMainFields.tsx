import { Controller, useFormState, useWatch, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { getRatingOptions, getMediationOptions } from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import type { DettagliFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'

type DettagliMainFieldsProps = {
  form: UseFormReturn<DettagliFormValues>
}

function DettagliMainFields({ form }: DettagliMainFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const renewable = useWatch({ control, name: 'mediationRenewable' }) === 'yes'

  return (
    <>
      <FormFieldWrapper label={t('scheda.dettagliMainFields.acquisitionDateLabel')} error={errors.acquisitionDate?.message}>
        <Input {...register('acquisitionDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.ratingLabel')} error={errors.rating?.message}>
        <Controller control={control} name="rating" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={getRatingOptions(t)} />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('scheda.dettagliMainFields.mediationTypeLabel')}
        hint={t('scheda.dettagliMainFields.mediationTypeHint')}
        error={errors.mediationType?.message}
      >
        <Controller control={control} name="mediationType" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={getMediationOptions(t)}
            placeholder={t('scheda.dettagliMainFields.mediationTypePlaceholder')}
          />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('scheda.dettagliMainFields.mediationExpiresAtLabel')}
        error={errors.mediationExpiresAt?.message}
      >
        <Input {...register('mediationExpiresAt')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('scheda.dettagliMainFields.mediationRenewableLabel')}
        error={errors.mediationRenewable?.message}
      >
        <Controller control={control} name="mediationRenewable" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={[
              { value: 'yes', label: t('scheda.dettagliMainFields.yes') },
              { value: 'no', label: t('scheda.dettagliMainFields.no') },
            ]}
          />
        )} />
      </FormFieldWrapper>

      {renewable && (
        <FormFieldWrapper
          label={t('scheda.dettagliMainFields.mediationRenewalMonthsLabel')}
          error={errors.mediationRenewalMonths?.message}
        >
          <Input {...register('mediationRenewalMonths')} type="number" min={1} step={1} />
        </FormFieldWrapper>
      )}

      <FormFieldWrapper label={t('scheda.dettagliMainFields.subtypeLabel')} error={errors.subtype?.message}>
        <Input {...register('subtype')} placeholder={t('scheda.dettagliMainFields.subtypePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.mediationFeeClientLabel')} error={errors.mediationFeeClientPct?.message}>
        <Input {...register('mediationFeeClientPct')} type="number" step="0.01" />
      </FormFieldWrapper>

      <div className={renewable ? 'sm:col-span-2' : undefined}>
        <FormFieldWrapper label={t('scheda.dettagliMainFields.mediationFeeOwnerLabel')} error={errors.mediationFeeOwnerPct?.message}>
          <Input {...register('mediationFeeOwnerPct')} type="number" step="0.01" />
        </FormFieldWrapper>
      </div>
    </>
  )
}

export default DettagliMainFields
