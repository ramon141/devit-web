import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useUserList } from '@/pages/Amministrazione/Utenti/hooks/useUserList'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useUtentiTour, MODAL_TOUR_START_STEP } from '@/pages/Amministrazione/Utenti/hooks/useUtentiTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import UserTable from '@/pages/Amministrazione/Utenti/components/UserTable'
import UserFormModal from '@/pages/Amministrazione/Utenti/components/UserFormModal'

function Utenti() {
  const { t } = useTranslation('amministrazione')
  const { users, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useUserList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<UserExcludingPasswordHashWithRelations>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useUtentiTour()

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
        searchPlaceholder={t('utenti.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('utenti.newLabel')}
        searchWrapperId="utenti-search-filter"
        newButtonId="utenti-new-btn"
      />

      <UserTable users={users} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <UserFormModal open={open} onOpenChange={handleModalOpenChange} user={editing} />
    </div>
  )
}

export default Utenti
