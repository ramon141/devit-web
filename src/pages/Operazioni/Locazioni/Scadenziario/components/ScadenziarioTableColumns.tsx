import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DataTableColumn } from '@/components/DataTable'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

type BuildScadenziarioTableColumnsProps = {
  onRenew: (contract: SalesRentalsReportControllerUpcomingRenewals200Item) => void
}

export function buildScadenziarioTableColumns({
  onRenew,
}: BuildScadenziarioTableColumnsProps): DataTableColumn<SalesRentalsReportControllerUpcomingRenewals200Item>[] {
  return [
    { header: 'Numero', cell: (contract) => <span className="font-medium">{contract.number}</span> },
    { header: 'Scadenza', cell: (contract) => formatDate(contract.renewalDueDate) },
    { header: 'Affitto', cell: (contract) => formatAmount(contract.rentAmount) },
    {
      header: 'Azioni',
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
