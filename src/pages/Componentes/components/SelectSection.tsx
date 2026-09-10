import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

type SelectFormValues = {
  propertyType: string
}

function SelectSection() {
  const { t } = useTranslation('componentes')
  const { control } = useForm<SelectFormValues>({
    defaultValues: { propertyType: 'villa' },
  })

  const propertyTypes = [
    { value: 'villa', label: t('propertyTypes.villa') },
    { value: 'appartamento', label: t('propertyTypes.appartamento') },
    { value: 'attico', label: t('propertyTypes.attico') },
    { value: 'casale', label: t('propertyTypes.casale') },
  ]

  return (
    <ComponentSection
      id="select"
      title={t('select.title')}
      description={t('select.description')}
    >
      <div className="max-w-xs">
        <FormFieldWrapper label={t('select.propertyTypeLabel')}>
          <Controller
            control={control}
            name="propertyType"
            render={({ field }) => (
              <SelectField
                value={field.value}
                onValueChange={field.onChange}
                options={propertyTypes}
                placeholder={t('select.placeholder')}
              />
            )}
          />
        </FormFieldWrapper>
      </div>
    </ComponentSection>
  )
}

export default SelectSection
