import dayjs from 'dayjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RentalAdjustmentWithRelations } from '@/api/generated/models'

type GeneratedAdjustmentsTableProps = {
  adjustments: RentalAdjustmentWithRelations[]
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function GeneratedAdjustmentsTable({ adjustments }: GeneratedAdjustmentsTableProps) {
  if (adjustments.length === 0) return null

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium">Ultimi adeguamenti generati</p>

      <div className="overflow-hidden rounded-xl ring-1 ring-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contratto</TableHead>
              <TableHead>Indice %</TableHead>
              <TableHead>Valore precedente</TableHead>
              <TableHead>Nuovo valore</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adjustment) => (
              <TableRow key={adjustment.id}>
                <TableCell className="font-medium">{adjustment.rentalContract?.number ?? '—'}</TableCell>
                <TableCell>{adjustment.indexPercent}%</TableCell>
                <TableCell>{formatAmount(adjustment.oldAmount)}</TableCell>
                <TableCell>{formatAmount(adjustment.newAmount)}</TableCell>
                <TableCell>{dayjs(adjustment.effectiveDate).format('DD/MM/YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GeneratedAdjustmentsTable
