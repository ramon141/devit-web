import { useContractRegistrations } from '@/pages/Operazioni/Locazioni/Registrazioni/hooks/useContractRegistrations'
import RegistrazioniTable from '@/pages/Operazioni/Locazioni/Registrazioni/components/RegistrazioniTable'

function Registrazioni() {
  const { contracts, isLoading, markRegistered, isMarking } = useContractRegistrations()

  return (
    <RegistrazioniTable
      contracts={contracts}
      isLoading={isLoading}
      onMarkRegistered={markRegistered}
      isMarking={isMarking}
    />
  )
}

export default Registrazioni
