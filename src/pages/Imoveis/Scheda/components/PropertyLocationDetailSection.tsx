import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyLocationDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLocationDetailForm'

type PropertyLocationDetailSectionProps = {
  propertyId: string
}

function PropertyLocationDetailSection({ propertyId }: PropertyLocationDetailSectionProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyLocationDetailForm(propertyId)
  const { register, control } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <Separator className="sm:col-span-2" />
      <p className="text-sm font-medium sm:col-span-2">{t('scheda.locationDetailSection.title')}</p>

      <FormFieldWrapper label={t('scheda.locationDetailSection.latitudeLabel')}>
        <Input {...register('latitude')} type="number" step="0.000001" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.longitudeLabel')}>
        <Input {...register('longitude')} type="number" step="0.000001" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.positionLabel')}>
        <Input {...register('position')} placeholder={t('scheda.locationDetailSection.positionPlaceholder')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.distanceToWaterLabel')}>
        <Input {...register('distanceToWaterM')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.floorLabel')}>
        <Input {...register('floorNumber')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.totalFloorsLabel')}>
        <Input {...register('totalFloors')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.builtYearLabel')}>
        <Input {...register('builtYear')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.totalUnitsLabel')}>
        <Input {...register('totalUnitsInBuilding')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.locationDetailSection.usableAreaLabel')}>
        <Input {...register('usableAreaSqm')} type="number" />
      </FormFieldWrapper>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasElevator" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.locationDetailSection.hasElevator')}
          </label>
        )} />
        <Controller control={control} name="hasArchitecturalBarriers" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.locationDetailSection.hasArchitecturalBarriers')}
          </label>
        )} />
      </div>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{t('scheda.locationDetailSection.save')}</Button>
      </div>
    </form>
  )
}

export default PropertyLocationDetailSection
