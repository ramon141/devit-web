import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { AdditionalFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyAdditionalForm'

type PropertyAdditionalSectionProps = {
  form: UseFormReturn<AdditionalFormValues>
}

function PropertyAdditionalSection({ form }: PropertyAdditionalSectionProps) {
  const { t } = useTranslation('imoveis')
  const { register } = form

  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
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
    </div>
  )
}

export default PropertyAdditionalSection
