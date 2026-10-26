import BrokerCodeFilter from '@/components/BrokerCodeFilter'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersBrokerProps = {
  filters: PropertyFiltersValues
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersBroker({ filters, update }: PropertyFiltersBrokerProps) {
  return (
    <BrokerCodeFilter
      value={filters.brokerCode}
      onChange={(brokerCode) => update({ brokerCode })}
    />
  )
}

export default PropertyFiltersBroker
