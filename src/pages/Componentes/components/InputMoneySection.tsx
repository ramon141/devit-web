import { useState } from 'react'
import InputMoney from '@/components/InputMoney'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function InputMoneySection() {
  const [price, setPrice] = useState<string | undefined>('835000.00')

  return (
    <ComponentSection
      id="input-money"
      title="Input Money"
      description="Campo monetario con maschera in euro, valore in stringa decimale."
    >
      <div className="grid max-w-xs gap-2">
        <InputMoney
          name="price"
          label="Prezzo dell'immobile"
          value={price}
          setValue={setPrice}
          required
        />
        <p className="text-xs text-muted-foreground">
          Valore grezzo: {price ?? '—'}
        </p>
      </div>
    </ComponentSection>
  )
}

export default InputMoneySection
