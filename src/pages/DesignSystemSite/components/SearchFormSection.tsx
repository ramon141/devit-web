import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import Section from '@/pages/DesignSystemSite/components/Section'

type SearchFormValues = {
  contract: string
  zone: string
  type: string
}

function SearchFormSection() {
  const { t } = useTranslation('designSystemSite')
  const { control } = useForm<SearchFormValues>({
    defaultValues: { contract: '', zone: '', type: '' },
  })

  const contractOptions = [
    { value: 'vendita', label: t('searchForm.contractSale') },
    { value: 'affitto', label: t('searchForm.contractRent') },
  ]
  const zoneOptions = [
    { value: 'chiaia', label: 'Chiaia' },
    { value: 'vomero', label: 'Vomero' },
    { value: 'fuorigrotta', label: 'Fuorigrotta' },
  ]
  const typeOptions = [
    { value: 'appartamento', label: t('propertyTypes.appartamento') },
    { value: 'villa', label: t('propertyTypes.villa') },
    { value: 'attico', label: t('propertyTypes.attico') },
  ]

  return (
    <Section id="search-form" title={t('searchForm.title')} description={t('searchForm.description')}>
      <div className="flex flex-wrap items-end gap-3.5 rounded-xl border bg-white p-4">
        <div className="w-44">
          <FormFieldWrapper label={t('searchForm.contractLabel')}>
            <Controller
              control={control}
              name="contract"
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onValueChange={field.onChange}
                  options={contractOptions}
                  placeholder={t('searchForm.contractPlaceholder')}
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="w-44">
          <FormFieldWrapper label={t('searchForm.zoneLabel')}>
            <Controller
              control={control}
              name="zone"
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onValueChange={field.onChange}
                  options={zoneOptions}
                  placeholder={t('searchForm.zonePlaceholder')}
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="w-44">
          <FormFieldWrapper label={t('searchForm.typeLabel')}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onValueChange={field.onChange}
                  options={typeOptions}
                  placeholder={t('searchForm.typePlaceholder')}
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <button
          type="button"
          className="rounded-lg px-6 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: '#0b0b0b', color: '#fbf7ef' }}
        >
          {t('searchForm.submit')}
        </button>
      </div>
    </Section>
  )
}

export default SearchFormSection
