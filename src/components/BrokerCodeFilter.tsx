import { useTranslation } from 'react-i18next'
import { useUserControllerFind } from '@/api/generated/api'
import SearchableSelect from '@/components/SearchableSelect'
import { formatBroker } from '@/utils/formatBroker'

type BrokerCodeFilterProps = {
  id?: string
  value: string
  onChange: (value: string) => void
}

// Filtro "agente responsabile" das listagens: escolhe o corretor, o valor continua sendo o código
function BrokerCodeFilter({ id, value, onChange }: BrokerCodeFilterProps) {
  const { t } = useTranslation('imoveis')
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const options = (users ?? []).flatMap((user) =>
    user.brokerCode && user.active !== false
      ? [{ value: user.brokerCode, label: formatBroker(user) }]
      : [],
  )

  return (
    <div id={id}>
      <SearchableSelect
        label={t('filters.brokerLabel')}
        value={value}
        onValueChange={onChange}
        options={options}
        placeholder={t('filters.brokerPlaceholder')}
      />
    </div>
  )
}

export default BrokerCodeFilter
