import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { AuditLog } from '@/api/generated/models'
import { AuditLogAction } from '@/api/generated/models/auditLogAction'
import { formatDateTime } from '@/utils/formatDate'

type AuditLogTableProps = {
  logs: AuditLog[]
  isLoading: boolean
}

function AuditLogTable({ logs, isLoading }: AuditLogTableProps) {
  const { t } = useTranslation('amministrazione')

  const actionLabels: Record<string, string> = Object.fromEntries(
    Object.values(AuditLogAction).map(action => [
      action,
      t(`auditLogTable.actions.${action}`),
    ]),
  )

  const columns: DataTableColumn<AuditLog>[] = [
    {
      header: t('auditLogTable.columns.action'),
      cell: (log) => <Badge variant="secondary">{actionLabels[log.action] ?? log.action}</Badge>,
    },
    {
      header: t('auditLogTable.columns.entity'),
      cell: (log) => <span className="font-medium">{log.entity}</span>,
    },
    {
      header: t('auditLogTable.columns.entityId'),
      cellClassName: 'max-w-40 truncate text-xs text-muted-foreground',
      cell: (log) => log.entityId ?? '—',
    },
    { header: t('auditLogTable.columns.user'), cell: (log) => log.userId ?? '—' },
    { header: t('auditLogTable.columns.date'), cell: (log) => formatDateTime(log.createdAt) },
  ]

  return (
    <DataTable
      columns={columns}
      data={logs}
      keyExtractor={(log) => String(log.id ?? '')}
      isLoading={isLoading}
      emptyMessage={t('auditLogTable.empty')}
    />
  )
}

export default AuditLogTable
