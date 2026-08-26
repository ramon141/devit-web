import type { TFunction } from 'i18next'
import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DataTableColumn } from '@/components/DataTable'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

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
      header: t('operazioni:locazioni.scadenziario.tableColumns.scadenza'),
      cell: (contract) => formatDate(contract.renewalDueDate),
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
