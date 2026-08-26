import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyAdditionalForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyAdditionalForm'

type PropertyAdditionalSectionProps = {
  propertyId: string
}

function PropertyAdditionalSection({ propertyId }: PropertyAdditionalSectionProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyAdditionalForm(propertyId)
  const { register } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <p className="text-sm font-medium sm:col-span-2">{t('scheda.additionalSection.title')}</p>

      <FormFieldWrapper label={t('scheda.additionalSection.roomsCountLabel')}>
        <Input {...register('roomsCount')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.additionalSection.qualityLabel')}>
        <Input {...register('quality')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.additionalSection.habitabilityLabel')}>
        <Input {...register('habitability')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.additionalSection.windowFramesLabel')}>
        <Input {...register('windowFrames')} />
      </FormFieldWrapper>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{t('scheda.additionalSection.save')}</Button>
      </div>
    </form>
  )
}

export default PropertyAdditionalSection
