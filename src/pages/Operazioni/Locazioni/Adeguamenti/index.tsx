import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ExportMenu from '@/components/ExportMenu'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useRentalAdjustments } from '@/pages/Operazioni/Locazioni/Adeguamenti/hooks/useRentalAdjustments'
import { useAdeguamentiTour } from '@/pages/Operazioni/Locazioni/Adeguamenti/hooks/useAdeguamentiTour'
import EligibleContractsTable from '@/pages/Operazioni/Locazioni/Adeguamenti/components/EligibleContractsTable'
import GeneratedAdjustmentsTable from '@/pages/Operazioni/Locazioni/Adeguamenti/components/GeneratedAdjustmentsTable'

function AdeguamentiCanone() {
  const { t } = useTranslation('operazioni')
  const {
    contracts,
    isLoading,
    generated,
    selectedIds,
    toggleSelected,
    indexPercent,
    setIndexPercent,
    generateAdjustments,
    isGenerating,
  } = useRentalAdjustments()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useAdeguamentiTour()

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

      <p className="mb-4 text-sm text-muted-foreground">{t('locazioni.adeguamenti.index.description')}</p>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div id="adeguamenti-index-filter" className="w-48">
          <FormFieldWrapper label={t('locazioni.adeguamenti.index.indexPercentLabel')}>
            <Input
              value={indexPercent}
              onChange={(event) => setIndexPercent(event.target.value)}
              type="number"
              step="0.01"
              placeholder={t('locazioni.adeguamenti.index.indexPercentPlaceholder')}
            />
          </FormFieldWrapper>
        </div>
        <Button
          id="adeguamenti-generate-btn"
          onClick={generateAdjustments}
          disabled={!indexPercent || isGenerating}
        >
          {t('locazioni.adeguamenti.index.generateButton')}
        </Button>

        <ExportMenu path="/rental-adjustments/export" />
      </div>

      <EligibleContractsTable
        contracts={contracts}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggle={toggleSelected}
      />

      <GeneratedAdjustmentsTable adjustments={generated} />
    </div>
  )
}

export default AdeguamentiCanone
