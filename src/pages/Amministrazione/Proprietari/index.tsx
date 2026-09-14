import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import DataTable from '@/components/DataTable'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import { useOwnerAccessList } from '@/pages/Amministrazione/Proprietari/hooks/useOwnerAccessList'
import { useOwnerAccessActions } from '@/pages/Amministrazione/Proprietari/hooks/useOwnerAccessActions'
import { useProprietariTour, MODAL_TOUR_START_STEP } from '@/pages/Amministrazione/Proprietari/hooks/useProprietariTour'
import OwnerAccessFormModal from '@/pages/Amministrazione/Proprietari/components/OwnerAccessFormModal'
import PinRevealDialog from '@/pages/Amministrazione/Proprietari/components/PinRevealDialog'
import { buildOwnerAccessTableColumns } from '@/pages/Amministrazione/Proprietari/components/OwnerAccessTableColumns'
import type { OwnerPortalAccess } from '@/pages/Amministrazione/Proprietari/types'

function Proprietari() {
  const { t } = useTranslation('amministrazione')
  const { accesses, isLoading, refetch } = useOwnerAccessList()
  const { resetPin, toggleActive, revealedPin, clearRevealedPin } = useOwnerAccessActions(refetch)
  const [formOpen, setFormOpen] = useState(false)
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useProprietariTour()

  useTourModalSync({
    run,
    stepIndex,
    modalStartStep: MODAL_TOUR_START_STEP,
    isOpen: formOpen,
    openModal: () => setFormOpen(true),
    closeModal: () => setFormOpen(false),
    steps,
  })

  function handleModalOpenChange(nextOpen: boolean) {
    setFormOpen(nextOpen)
    if (!nextOpen && run) stopTour()
  }

  const columns = buildOwnerAccessTableColumns({
    onResetPin: (access: OwnerPortalAccess) => resetPin(access.id),
    onToggleActive: (access: OwnerPortalAccess, active: boolean) => toggleActive(access.id, active),
  })

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
        search=""
        onSearchChange={() => {}}
        onNewClick={() => setFormOpen(true)}
        newLabel={t('proprietari.newLabel')}
        newButtonId="proprietari-new-btn"
      />

      <div id="proprietari-table">
        <DataTable
          columns={columns}
          data={accesses}
          keyExtractor={(access) => access.id}
          isLoading={isLoading}
          emptyMessage={t('proprietari.empty')}
        />
      </div>

      <OwnerAccessFormModal open={formOpen} onOpenChange={handleModalOpenChange} onCreated={refetch} />
      <PinRevealDialog pin={revealedPin} onClose={clearRevealedPin} />
    </div>
  )
}

export default Proprietari
