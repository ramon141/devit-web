import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { CadastralFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCadastralForm'

type PropertyCadastralSectionProps = {
  form: UseFormReturn<CadastralFormValues>
}

function PropertyCadastralSection({ form }: PropertyCadastralSectionProps) {
  const { t } = useTranslation('imoveis')
  const { register } = form

  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
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
    </div>
  )
}

export default PropertyCadastralSection
