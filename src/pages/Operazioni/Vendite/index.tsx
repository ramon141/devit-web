import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleList } from '@/pages/Operazioni/Vendite/hooks/useSaleList'
import { useEditModalState } from '@/hooks/useEditModalState'
import {
  useVenditeTour,
  MODAL_TOUR_START_STEP,
  getVenditeTourActiveTab,
} from '@/pages/Operazioni/Vendite/hooks/useVenditeTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import SaleTable from '@/pages/Operazioni/Vendite/components/SaleTable'
import SaleFormModal from '@/pages/Operazioni/Vendite/components/SaleFormModal'
import SaleFilters from '@/pages/Operazioni/Vendite/components/SaleFilters'

function Vendite() {
  const { t } = useTranslation('operazioni')
  const {
    sales,
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
  } = useSaleList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<SaleWithRelations>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useVenditeTour()

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

  const tourActiveTab = run && stepIndex >= MODAL_TOUR_START_STEP ? getVenditeTourActiveTab(stepIndex) : undefined

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
        searchPlaceholder={t('vendite.index.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('vendite.index.newLabel')}
        searchWrapperId="vendite-search-filter"
        newButtonId="vendite-new-btn"
        filters={<SaleFilters filters={filters} onChange={setFilters} />}
        actions={<ExportMenu path="/sales/export" params={{ filter: { where } }} />}
      />

      <SaleTable sales={sales} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <SaleFormModal
        open={open}
        onOpenChange={handleModalOpenChange}
        sale={editing}
        tourActiveTab={tourActiveTab}
      />
    </div>
  )
}

export default Vendite
