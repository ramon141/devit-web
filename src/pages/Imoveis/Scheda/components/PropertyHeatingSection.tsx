import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { usePropertyHeatingForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'

type PropertyHeatingSectionProps = {
  propertyId: string
}

function PropertyHeatingSection({ propertyId }: PropertyHeatingSectionProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyHeatingForm(propertyId)
  const { register, control } = form

  const heatingTypeOptions = [
    { value: 'autonomous', label: t('scheda.heatingSection.typeOptions.autonomous') },
    { value: 'centralized', label: t('scheda.heatingSection.typeOptions.centralized') },
    { value: 'none', label: t('scheda.heatingSection.typeOptions.none') },
  ]

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <p className="text-sm font-medium sm:col-span-2">{t('scheda.heatingSection.title')}</p>

      <FormFieldWrapper label={t('scheda.heatingSection.typeLabel')}>
        <Controller control={control} name="heatingType" render={({ field }) => (
          <SelectField
            value={field.value}
            onValueChange={field.onChange}
            options={heatingTypeOptions}
            placeholder={t('scheda.heatingSection.typePlaceholder')}
          />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.heatingSection.fuelLabel')}>
        <Input {...register('fuel')} placeholder={t('scheda.heatingSection.fuelPlaceholder')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.heatingSection.systemLabel')}>
        <Input {...register('system')} placeholder={t('scheda.heatingSection.systemPlaceholder')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.heatingSection.monthlyCostLabel')}>
        <Input {...register('monthlyCost')} type="number" />
      </FormFieldWrapper>

      <Controller control={control} name="hasRadiators" render={({ field }) => (
        <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
          <Switch checked={field.value} onCheckedChange={field.onChange} />
          {t('scheda.heatingSection.hasRadiators')}
        </label>
      )} />

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{t('scheda.heatingSection.save')}</Button>
      </div>
    </form>
  )
}

export default PropertyHeatingSection
