import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyCadastralForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCadastralForm'

type PropertyCadastralSectionProps = {
  propertyId: string
}

function PropertyCadastralSection({ propertyId }: PropertyCadastralSectionProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyCadastralForm(propertyId)
  const { register } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
      <p className="text-sm font-medium sm:col-span-3">{t('scheda.cadastralSection.title')}</p>

      <FormFieldWrapper label={t('scheda.cadastralSection.registeredAtLabel')}>
        <Input {...register('registeredAt')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.partitaLabel')}>
        <Input {...register('partita')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.mappaliLabel')}>
        <Input {...register('mappali')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.categoryLabel')}>
        <Input {...register('category')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.foglioLabel')}>
        <Input {...register('foglio')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.particellaLabel')}>
        <Input {...register('particella')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.subalternoLabel')}>
        <Input {...register('subalterno')} />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.cadastralSection.renditaLabel')}>
        <Input {...register('rendita')} type="number" />
      </FormFieldWrapper>

      <div className="flex justify-end sm:col-span-3">
        <Button type="submit" disabled={isSubmitting}>{t('scheda.cadastralSection.save')}</Button>
      </div>
    </form>
  )
}

export default PropertyCadastralSection
