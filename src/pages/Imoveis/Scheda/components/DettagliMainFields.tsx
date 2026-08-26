import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { useUserControllerFind } from '@/api/generated/api'
import { getRatingOptions, getMediationOptions } from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import type { DettagliFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'

type DettagliMainFieldsProps = {
  form: UseFormReturn<DettagliFormValues>
}

function DettagliMainFields({ form }: DettagliMainFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const { data: agents } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })
  const agentOptions = (agents ?? []).map((agent) => ({ value: agent.id ?? '', label: agent.fullName }))

  return (
    <>
      <FormFieldWrapper label={t('scheda.dettagliMainFields.acquisitionDateLabel')} error={errors.acquisitionDate?.message}>
        <Input {...register('acquisitionDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.listingStageLabel')} error={errors.listingStage?.message}>
        <Input {...register('listingStage')} placeholder={t('scheda.dettagliMainFields.listingStagePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.ratingLabel')} error={errors.rating?.message}>
        <Controller control={control} name="rating" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={getRatingOptions(t)} />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.agentLabel')} error={errors.agentId?.message}>
        <Controller control={control} name="agentId" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={agentOptions}
            placeholder={t('scheda.dettagliMainFields.agentPlaceholder')}
          />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.mediationTypeLabel')} error={errors.mediationType?.message}>
        <Controller control={control} name="mediationType" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={getMediationOptions(t)}
            placeholder={t('scheda.dettagliMainFields.mediationTypePlaceholder')}
          />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.subtypeLabel')} error={errors.subtype?.message}>
        <Input {...register('subtype')} placeholder={t('scheda.dettagliMainFields.subtypePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.mediationFeeClientLabel')} error={errors.mediationFeeClientPct?.message}>
        <Input {...register('mediationFeeClientPct')} type="number" step="0.01" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('scheda.dettagliMainFields.mediationFeeOwnerLabel')} error={errors.mediationFeeOwnerPct?.message}>
        <Input {...register('mediationFeeOwnerPct')} type="number" step="0.01" />
      </FormFieldWrapper>
    </>
  )
}

export default DettagliMainFields
