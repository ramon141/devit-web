import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { useRentalAdjustments } from '@/pages/Operazioni/Locazioni/Adeguamenti/hooks/useRentalAdjustments'
import EligibleContractsTable from '@/pages/Operazioni/Locazioni/Adeguamenti/components/EligibleContractsTable'
import GeneratedAdjustmentsTable from '@/pages/Operazioni/Locazioni/Adeguamenti/components/GeneratedAdjustmentsTable'

function AdeguamentiCanone() {
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

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Seleziona i contratti attivi da adeguare (lascia tutto deselezionato per applicare a tutti i
        contratti attivi), inserisci la variazione percentuale ISTAT e genera le comunicazioni.
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48">
          <FormFieldWrapper label="Variazione percentuale ISTAT">
            <Input
              value={indexPercent}
              onChange={(event) => setIndexPercent(event.target.value)}
              type="number"
              step="0.01"
              placeholder="Es. 5"
            />
          </FormFieldWrapper>
        </div>
        <Button onClick={generateAdjustments} disabled={!indexPercent || isGenerating}>
          Genera documenti
        </Button>
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
