import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersBrokerProps = {
  filters: PropertyFiltersValues
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersBroker({ filters, update }: PropertyFiltersBrokerProps) {
  const { t } = useTranslation('imoveis')

  return (
    <FormFieldWrapper label={t('filters.brokerLabel')}>
      <Input
        value={filters.brokerCode}
        onChange={(event) => update({ brokerCode: event.target.value })}
        placeholder={t('filters.brokerPlaceholder')}
      />
    </FormFieldWrapper>
  )
}

export default PropertyFiltersBroker
