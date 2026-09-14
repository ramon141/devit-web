import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useUpcomingRenewals } from '@/pages/Operazioni/Locazioni/Scadenziario/hooks/useUpcomingRenewals'
import { useScadenziarioTour } from '@/pages/Operazioni/Locazioni/Scadenziario/hooks/useScadenziarioTour'
import ScadenziarioTable from '@/pages/Operazioni/Locazioni/Scadenziario/components/ScadenziarioTable'

function Scadenziario() {
  const { t } = useTranslation('operazioni')
  const { contracts, isLoading, days, setDays } = useUpcomingRenewals()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useScadenziarioTour()

  return (
    <div>
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <div id="scadenziario-days-filter" className="mb-4 w-48">
        <FormFieldWrapper label={t('locazioni.scadenziario.index.windowLabel')}>
          <Input value={days} onChange={(event) => setDays(event.target.value)} type="number" />
        </FormFieldWrapper>
      </div>

      <ScadenziarioTable contracts={contracts} isLoading={isLoading} />
    </div>
  )
}

export default Scadenziario
