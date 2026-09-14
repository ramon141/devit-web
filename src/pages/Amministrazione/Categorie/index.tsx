import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { PropertyCategory } from '@/api/generated/models'
import { useCategoryList } from '@/pages/Amministrazione/Categorie/hooks/useCategoryList'
import { useEditModalState } from '@/hooks/useEditModalState'
import {
  useCategorieTour,
  MODAL_TOUR_START_STEP,
} from '@/pages/Amministrazione/Categorie/hooks/useCategorieTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import CategoryTable from '@/pages/Amministrazione/Categorie/components/CategoryTable'
import CategoryFormModal from '@/pages/Amministrazione/Categorie/components/CategoryFormModal'

function Categorie() {
  const { t } = useTranslation('amministrazione')
  const { categories, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useCategoryList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<PropertyCategory>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useCategorieTour()

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
        searchPlaceholder={t('categorie.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('categorie.newLabel')}
        searchWrapperId="categorie-search-filter"
        newButtonId="categorie-new-btn"
      />

      <CategoryTable categories={categories} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <CategoryFormModal open={open} onOpenChange={handleModalOpenChange} category={editing} />
    </div>
  )
}

export default Categorie
