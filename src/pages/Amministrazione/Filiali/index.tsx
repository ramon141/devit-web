import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { Branch } from '@/api/generated/models'
import { useBranchList } from '@/pages/Amministrazione/Filiali/hooks/useBranchList'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useFilialiTour, MODAL_TOUR_START_STEP } from '@/pages/Amministrazione/Filiali/hooks/useFilialiTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import BranchTable from '@/pages/Amministrazione/Filiali/components/BranchTable'
import BranchFormModal from '@/pages/Amministrazione/Filiali/components/BranchFormModal'

function Filiali() {
  const { t } = useTranslation('amministrazione')
  const { branches, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBranchList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<Branch>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useFilialiTour()

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
        searchPlaceholder={t('filiali.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('filiali.newLabel')}
        searchWrapperId="filiali-search-filter"
        newButtonId="filiali-new-btn"
      />

      <BranchTable branches={branches} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <BranchFormModal open={open} onOpenChange={handleModalOpenChange} branch={editing} />
    </div>
  )
}

export default Filiali
