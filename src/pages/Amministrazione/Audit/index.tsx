import TablePagination from '@/components/TablePagination'
import { useAuditLogList } from '@/pages/Amministrazione/Audit/hooks/useAuditLogList'
import AuditLogTable from '@/pages/Amministrazione/Audit/components/AuditLogTable'

function Audit() {
  const { logs, isLoading, totalItems, pageSize, page, setPage } = useAuditLogList()

  return (
    <div>
      <AuditLogTable logs={logs} isLoading={isLoading} />

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
