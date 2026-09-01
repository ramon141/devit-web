import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersRoomsRangeProps = {
  filters: PropertyFiltersValues
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersRoomsRange({ filters, update }: PropertyFiltersRoomsRangeProps) {
  const { t } = useTranslation('imoveis')

  return (
    <>
      <FormFieldWrapper label={t('filters.bedroomsFromLabel')}>
        <Input
          value={filters.bedroomsMin}
          onChange={(event) => update({ bedroomsMin: event.target.value })}
          type="number"
          placeholder={t('filters.bedroomsFromPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.bedroomsToLabel')}>
        <Input
          value={filters.bedroomsMax}
          onChange={(event) => update({ bedroomsMax: event.target.value })}
          type="number"
          placeholder={t('filters.bedroomsToPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.bathroomsFromLabel')}>
        <Input
          value={filters.bathroomsMin}
          onChange={(event) => update({ bathroomsMin: event.target.value })}
          type="number"
          placeholder={t('filters.bathroomsFromPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.bathroomsToLabel')}>
        <Input
          value={filters.bathroomsMax}
          onChange={(event) => update({ bathroomsMax: event.target.value })}
          type="number"
          placeholder={t('filters.bathroomsToPlaceholder')}
        />
      </FormFieldWrapper>
    </>
  )
}

export default PropertyFiltersRoomsRange
