import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type BrokerFilterValues = {
  brokerCode: string
  onlyMine: boolean
}

export type BrokerListParams = {
  mine?: boolean
  brokerCode?: string
}

// Parâmetros de "meus" e "código do corretor" aceitos pelas listagens de negociações
export function useBrokerListParams(filters: BrokerFilterValues): BrokerListParams {
  const debouncedBrokerCode = useDebouncedValue(filters.brokerCode.trim())

  return {
    mine: filters.onlyMine || undefined,
    brokerCode: debouncedBrokerCode || undefined,
  }
}
