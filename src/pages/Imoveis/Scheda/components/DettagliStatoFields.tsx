import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledSelectField from '@/components/ControlledSelectField'
import {
  getAvailabilityOptions,
  getConditionOptions,
  getFurnishedOptions,
} from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import type { DettagliFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'

type DettagliStatoFieldsProps = {
  form: UseFormReturn<DettagliFormValues>
}

function DettagliStatoFields({ form }: DettagliStatoFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <>
      <ControlledSelectField
        control={control}
        name="availability"
        label={t('scheda.dettagliStatoFields.availabilityLabel')}
        options={getAvailabilityOptions(t)}
        placeholder={t('scheda.dettagliStatoFields.availabilityPlaceholder')}
        error={errors.availability?.message}
      />

      <ControlledSelectField
        control={control}
        name="condition"
        label={t('scheda.dettagliStatoFields.conditionLabel')}
        options={getConditionOptions(t)}
        placeholder={t('scheda.dettagliStatoFields.conditionPlaceholder')}
        error={errors.condition?.message}
      />

      <ControlledSelectField
        control={control}
        name="furnished"
        label={t('scheda.dettagliStatoFields.furnishedLabel')}
        options={getFurnishedOptions(t)}
        placeholder={t('scheda.dettagliStatoFields.furnishedPlaceholder')}
        error={errors.furnished?.message}
      />

      <FormFieldWrapper label={t('scheda.dettagliStatoFields.exposureLabel')} error={errors.exposure?.message}>
        <Input {...register('exposure')} placeholder={t('scheda.dettagliStatoFields.exposurePlaceholder')} />
      </FormFieldWrapper>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Controller control={control} name="bareOwnership" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.dettagliStatoFields.bareOwnership')}
          </label>
        )} />
        <Controller control={control} name="prestige" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.dettagliStatoFields.prestige')}
          </label>
        )} />
        <Controller control={control} name="newConstruction" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.dettagliStatoFields.newConstruction')}
          </label>
        )} />
        <Controller control={control} name="availableImmediately" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.dettagliStatoFields.availableImmediately')}
          </label>
        )} />
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('scheda.dettagliStatoFields.internalNoteLabel')} error={errors.internalNote?.message}>
          <Textarea {...register('internalNote')} rows={2} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('scheda.dettagliStatoFields.sharedNoteLabel')} error={errors.sharedNote?.message}>
          <Textarea {...register('sharedNote')} rows={2} />
        </FormFieldWrapper>
      </div>
    </>
  )
}

export default DettagliStatoFields
