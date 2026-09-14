import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { Zone } from '@/api/generated/models'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useZoneList } from '@/pages/Amministrazione/Zone/hooks/useZoneList'
import { useZoneTour, MODAL_TOUR_START_STEP } from '@/pages/Amministrazione/Zone/hooks/useZoneTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import ZoneTable from '@/pages/Amministrazione/Zone/components/ZoneTable'
import ZoneFormModal from '@/pages/Amministrazione/Zone/components/ZoneFormModal'
import NeighborhoodPanel from '@/pages/Amministrazione/Zone/components/NeighborhoodPanel'

function ZonePage() {
  const { t } = useTranslation('amministrazione')
  const { zones, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useZoneList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<Zone>()
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useZoneTour()

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
    <div className="grid gap-4">
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
        searchPlaceholder={t('zone.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('zone.newLabel')}
        searchWrapperId="zone-search-filter"
        newButtonId="zone-new-btn"
      />

      <ZoneTable
        zones={zones}
        isLoading={isLoading}
        onEdit={openEdit}
        onSelect={setSelectedZone}
        selectedZoneId={selectedZone?.id}
      />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      {selectedZone && <NeighborhoodPanel zone={selectedZone} />}

      <ZoneFormModal open={open} onOpenChange={handleModalOpenChange} zone={editing} />
    </div>
  )
}

export default ZonePage
