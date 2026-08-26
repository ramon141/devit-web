import { Badge } from '@/components/ui/badge'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { AuditLog } from '@/api/generated/models'
import { formatDateTime } from '@/utils/formatDate'

const actionLabels: Record<string, string> = {
  create: 'Creazione',
  update: 'Aggiornamento',
  delete: 'Eliminazione',
  login: 'Accesso',
  logout: 'Uscita',
  export: 'Esportazione',
}

type AuditLogTableProps = {
  logs: AuditLog[]
  isLoading: boolean
}

function AuditLogTable({ logs, isLoading }: AuditLogTableProps) {
  const columns: DataTableColumn<AuditLog>[] = [
    {
      header: 'Azione',
      cell: (log) => <Badge variant="secondary">{actionLabels[log.action] ?? log.action}</Badge>,
    },
    { header: 'Entità', cell: (log) => <span className="font-medium">{log.entity}</span> },
    {
      header: 'ID entità',
      cellClassName: 'max-w-40 truncate text-xs text-muted-foreground',
      cell: (log) => log.entityId ?? '—',
    },
    { header: 'Utente', cell: (log) => log.userId ?? '—' },
    { header: 'Data', cell: (log) => formatDateTime(log.createdAt) },
  ]

  return (
    <DataTable
      columns={columns}
      data={logs}
      keyExtractor={(log) => String(log.id ?? '')}
      isLoading={isLoading}
      emptyMessage="Nessun log trovato."
    />
  )
}

export default AuditLogTable
