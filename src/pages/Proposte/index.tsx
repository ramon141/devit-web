import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalList } from '@/pages/Proposte/hooks/useProposalList'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useProposteTour, MODAL_TOUR_START_STEP } from '@/pages/Proposte/hooks/useProposteTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import ProposalFilters from '@/pages/Proposte/components/ProposalFilters'
import ProposalTable from '@/pages/Proposte/components/ProposalTable'
import ProposalFormModal from '@/pages/Proposte/components/ProposalFormModal'

function Proposte() {
  const { t } = useTranslation('proposte')
  const {
    proposals,
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
  } = useProposalList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<PurchaseProposalWithRelations>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useProposteTour()

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
    <AppLayout
      title={t('page.title')}
      description={t('page.description')}
      breadcrumbItems={[{ label: t('page.breadcrumb') }]}
    >
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
        searchPlaceholder={t('page.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('page.newLabel')}
        searchWrapperId="proposte-search-filter"
        newButtonId="proposte-new-btn"
        filters={<ProposalFilters filters={filters} onChange={setFilters} />}
        actions={<ExportMenu path="/purchase-proposals/export" params={{ filter: { where } }} />}
      />

      <ProposalTable proposals={proposals} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <ProposalFormModal open={open} onOpenChange={handleModalOpenChange} proposal={editing} />
    </AppLayout>
  )
}

export default Proposte
