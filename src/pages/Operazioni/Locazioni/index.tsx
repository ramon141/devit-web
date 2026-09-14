import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useRentalContractList } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractList'
import { useEditModalState } from '@/hooks/useEditModalState'
import {
  useLocazioniTour,
  MODAL_TOUR_START_STEP,
  getLocazioniTourActiveTab,
} from '@/pages/Operazioni/Locazioni/hooks/useLocazioniTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import RentalTable from '@/pages/Operazioni/Locazioni/components/RentalTable'
import RentalFormModal from '@/pages/Operazioni/Locazioni/components/RentalFormModal'
import RentalFilters from '@/pages/Operazioni/Locazioni/components/RentalFilters'

function Locazioni() {
  const { t } = useTranslation('operazioni')
  const {
    contracts,
    where,
    isLoading,
    totalItems,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    filters,
    setFilters,
  } = useRentalContractList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<RentalContractWithRelations>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useLocazioniTour()

  useTourModalSync({
    run,
    stepIndex,
    modalStartStep: MODAL_TOUR_START_STEP,
    isOpen: open,
    openModal: openNew,
    closeModal: () => setOpen(false),
    steps,
  })

  function handleModalOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen && run) stopTour()
  }

  const tourActiveTab =
    run && stepIndex >= MODAL_TOUR_START_STEP ? getLocazioniTourActiveTab(stepIndex) : undefined

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

      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('locazioni.index.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('locazioni.index.newLabel')}
        searchWrapperId="locazioni-search-filter"
        newButtonId="locazioni-new-btn"
        filters={<RentalFilters filters={filters} onChange={setFilters} />}
        actions={<ExportMenu path="/rental-contracts/export" params={{ filter: { where } }} />}
      />

      <RentalTable contracts={contracts} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <RentalFormModal
        open={open}
        onOpenChange={handleModalOpenChange}
        contract={editing}
        tourActiveTab={tourActiveTab}
      />
    </div>
  )
}

export default Locazioni
