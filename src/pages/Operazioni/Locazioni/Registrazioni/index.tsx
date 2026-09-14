import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useContractRegistrations } from '@/pages/Operazioni/Locazioni/Registrazioni/hooks/useContractRegistrations'
import { useRegistrazioniTour } from '@/pages/Operazioni/Locazioni/Registrazioni/hooks/useRegistrazioniTour'
import RegistrazioniTable from '@/pages/Operazioni/Locazioni/Registrazioni/components/RegistrazioniTable'

function Registrazioni() {
  const { contracts, isLoading, markRegistered, isMarking } = useContractRegistrations()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useRegistrazioniTour()

  return (
    <>
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <RegistrazioniTable
        contracts={contracts}
        isLoading={isLoading}
        onMarkRegistered={markRegistered}
        isMarking={isMarking}
      />
    </>
  )
}

export default Registrazioni
