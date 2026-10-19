import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'

type BrokerCodeFilterProps = {
  id?: string
  value: string
  onChange: (value: string) => void
}

// Filtro "agente responsabile" das listagens: busca pelo código do corretor do imóvel
function BrokerCodeFilter({ id, value, onChange }: BrokerCodeFilterProps) {
  const { t } = useTranslation('imoveis')

  return (
    <FormFieldWrapper id={id} label={t('filters.brokerLabel')}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('filters.brokerPlaceholder')}
      />
    </FormFieldWrapper>
  )
}

export default BrokerCodeFilter
