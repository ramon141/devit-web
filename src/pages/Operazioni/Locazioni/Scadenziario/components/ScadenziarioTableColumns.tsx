import type { TFunction } from 'i18next'
import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

function isOverdue(dueDate?: string) {
  return !!dueDate && new Date(dueDate) < new Date(new Date().toDateString())
}

type BuildScadenziarioTableColumnsProps = {
  onRenew: (contract: SalesRentalsReportControllerUpcomingRenewals200Item) => void
}

export function buildScadenziarioTableColumns(
  { onRenew }: BuildScadenziarioTableColumnsProps,
  t: TFunction
): DataTableColumn<SalesRentalsReportControllerUpcomingRenewals200Item>[] {
  return [
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.numero'),
      cell: (contract) => <span className="font-medium">{contract.number}</span>,
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.immobile'),
      cell: (contract) => contract.propertyTitle ?? '—',
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.inquilino'),
      cell: (contract) => contract.tenantNames ?? '—',
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.proprietario'),
      cell: (contract) => contract.ownerNames ?? '—',
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.scadenza'),
      cell: (contract) => (
        <span className="flex items-center gap-2">
          {formatDate(contract.renewalDueDate)}
          {isOverdue(contract.renewalDueDate) && (
            <Badge variant="destructive">
              {t('operazioni:locazioni.scadenziario.tableColumns.scaduto')}
            </Badge>
          )}
        </span>
      ),
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.affitto'),
      cell: (contract) => formatAmount(contract.rentAmount),
    },
    {
      header: t('operazioni:locazioni.scadenziario.tableColumns.azioni'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (contract) => (
        <Button variant="ghost" size="icon-sm" onClick={() => onRenew(contract)}>
          <RefreshCwIcon className="size-4" />
        </Button>
      ),
    },
  ]
}
