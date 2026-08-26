import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { useUpcomingRenewals } from '@/pages/Operazioni/Locazioni/Scadenziario/hooks/useUpcomingRenewals'
import ScadenziarioTable from '@/pages/Operazioni/Locazioni/Scadenziario/components/ScadenziarioTable'

function Scadenziario() {
  const { contracts, isLoading, days, setDays } = useUpcomingRenewals()

  return (
    <div>
      <div className="mb-4 w-48">
        <FormFieldWrapper label="Finestra di giorni">
          <Input value={days} onChange={(event) => setDays(event.target.value)} type="number" />
        </FormFieldWrapper>
      </div>

      <ScadenziarioTable contracts={contracts} isLoading={isLoading} />
    </div>
  )
}

export default Scadenziario
