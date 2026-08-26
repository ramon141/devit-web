import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { LandFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyLandForm'

type LandDetailFieldsProps = {
  form: UseFormReturn<LandFormValues>
}

function LandDetailFields({ form }: LandDetailFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form

  const terrainTypeOptions = [
    { value: 'flat', label: t('scheda.landDetailFields.terrainTypeOptions.flat') },
    { value: 'sloped', label: t('scheda.landDetailFields.terrainTypeOptions.sloped') },
  ]

  return (
    <>
      <FormFieldWrapper label={t('scheda.landDetailFields.terrainTypeLabel')}>
        <Controller control={control} name="terrainType" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={terrainTypeOptions}
            placeholder={t('scheda.landDetailFields.terrainTypePlaceholder')}
          />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.buildabilityIndexLabel')}>
        <Input {...register('buildabilityIndex')} type="number" step="0.01" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.buildableAreaLabel')}>
        <Input {...register('buildableAreaSqm')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.agriculturalAreaLabel')}>
        <Input {...register('agriculturalAreaSqm')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.possibleConstructionLabel')}>
        <Input {...register('possibleConstruction')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.rightOfWayLabel')}>
        <Input {...register('rightOfWay')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.landDetailFields.preemptionRightsLabel')}>
        <Input {...register('preemptionRights')} />
      </FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('scheda.landDetailFields.plantationsLabel')}>
          <Textarea {...register('plantations')} rows={2} />
        </FormFieldWrapper>
      </div>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasExistingConstruction" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.landDetailFields.hasExistingConstruction')}
          </label>
        )} />
        <Controller control={control} name="projectApproved" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.landDetailFields.projectApproved')}
          </label>
        )} />
      </div>
    </>
  )
}

export default LandDetailFields
