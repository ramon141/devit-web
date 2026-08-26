import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputMoney from '@/components/InputMoney'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function InputMoneySection() {
  const { t } = useTranslation('componentes')
  const [price, setPrice] = useState<string | undefined>('835000.00')

  return (
    <ComponentSection
      id="input-money"
      title={t('inputMoney.title')}
      description={t('inputMoney.description')}
    >
      <div className="grid max-w-xs gap-2">
        <InputMoney
          name="price"
          label={t('inputMoney.priceLabel')}
          value={price}
          setValue={setPrice}
          required
        />
        <p className="text-xs text-muted-foreground">
          {t('inputMoney.rawValue', { value: price ?? '—' })}
        </p>
      </div>
    </ComponentSection>
  )
}

export default InputMoneySection
