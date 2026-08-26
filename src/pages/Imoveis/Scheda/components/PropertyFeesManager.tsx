import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import InputMoney from '@/components/InputMoney'
import type { NewPropertyFeeFrequency } from '@/api/generated/models'
import { feeFrequencyOptions } from '@/pages/Imoveis/Scheda/schemas/feeFrequencyOptions'
import { usePropertyFees } from '@/pages/Imoveis/Scheda/hooks/usePropertyFees'
import { formatAmount } from '@/utils/formatAmount'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyFeesManagerProps = {
  propertyId: string
}

function PropertyFeesManager({ propertyId }: PropertyFeesManagerProps) {
  const {
    fees,
    name,
    setName,
    amount,
    setAmount,
    frequency,
    setFrequency,
    note,
    setNote,
    addFee,
    removeFee,
  } = usePropertyFees(propertyId)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">Tasse e spese</p>

      <div className="grid gap-2">
        {fees.map((fee) => (
          <div key={fee.id} className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
            <span className="text-sm">
              {fee.name} · {formatAmount(fee.amount)} · {getOptionLabel(feeFrequencyOptions, fee.frequency)}
              {fee.note && ` · ${fee.note}`}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => fee.id && removeFee(fee.id)}>
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome tassa"
          className="w-40"
        />
        <div className="w-32">
          <InputMoney value={amount} setValue={setAmount} name="feeAmount" />
        </div>
        <div className="min-w-40">
          <SelectField
            value={frequency}
            onValueChange={(value) => setFrequency(value as NewPropertyFeeFrequency)}
            options={feeFrequencyOptions}
            placeholder="Frequenza"
          />
        </div>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
          className="w-40"
        />
        <Button type="button" onClick={addFee}>Aggiungi</Button>
      </div>
    </div>
  )
}

export default PropertyFeesManager
