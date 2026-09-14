import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useAuditLogList } from '@/pages/Amministrazione/Audit/hooks/useAuditLogList'
import { useAuditTour } from '@/pages/Amministrazione/Audit/hooks/useAuditTour'
import AuditLogTable from '@/pages/Amministrazione/Audit/components/AuditLogTable'

function Audit() {
  const { logs, isLoading, totalItems, pageSize, page, setPage } = useAuditLogList()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useAuditTour()

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

      <div id="audit-table">
        <AuditLogTable logs={logs} isLoading={isLoading} />
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Audit
