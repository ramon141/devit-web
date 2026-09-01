import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersAreaCityProps = {
  filters: PropertyFiltersValues
  cities: string[]
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersAreaCity({ filters, cities, update }: PropertyFiltersAreaCityProps) {
  const { t } = useTranslation('imoveis')

  return (
    <>
      <FormFieldWrapper label={t('filters.areaFromLabel')}>
        <Input
          value={filters.areaMin}
          onChange={(event) => update({ areaMin: event.target.value })}
          type="number"
          placeholder={t('filters.areaFromPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.areaToLabel')}>
        <Input
          value={filters.areaMax}
          onChange={(event) => update({ areaMax: event.target.value })}
          type="number"
          placeholder={t('filters.areaToPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.cityLabel')}>
        <SelectField
          value={filters.city}
          onValueChange={(value) => update({ city: value })}
          options={cities.map((city) => ({ value: city, label: city }))}
          placeholder={t('filters.cityPlaceholder')}
        />
      </FormFieldWrapper>
    </>
  )
}

export default PropertyFiltersAreaCity
