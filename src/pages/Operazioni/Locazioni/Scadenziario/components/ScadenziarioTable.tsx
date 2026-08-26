import { useState } from 'react'
import dayjs from 'dayjs'
import { RefreshCwIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import RentalRenewModal from '@/pages/Operazioni/Locazioni/components/RentalRenewModal'

type ScadenziarioTableProps = {
  contracts: SalesRentalsReportControllerUpcomingRenewals200Item[]
  isLoading: boolean
}

function formatAmount(value?: number) {
  if (value == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function ScadenziarioTable({ contracts, isLoading }: ScadenziarioTableProps) {
  const [renewTarget, setRenewTarget] = useState<SalesRentalsReportControllerUpcomingRenewals200Item | null>(
    null
  )

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numero</TableHead>
            <TableHead>Scadenza</TableHead>
            <TableHead>Affitto</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                Nessun contratto in scadenza nel periodo selezionato.
              </TableCell>
            </TableRow>
          )}

          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.number}</TableCell>
              <TableCell>
                {contract.renewalDueDate ? dayjs(contract.renewalDueDate).format('DD/MM/YYYY') : '—'}
              </TableCell>
              <TableCell>{formatAmount(contract.rentAmount)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => setRenewTarget(contract)}>
                  <RefreshCwIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RentalRenewModal
        open={!!renewTarget}
        onOpenChange={(open) => !open && setRenewTarget(null)}
        contractId={renewTarget?.id}
        contractNumber={renewTarget?.number}
      />
    </div>
  )
}

export default ScadenziarioTable
