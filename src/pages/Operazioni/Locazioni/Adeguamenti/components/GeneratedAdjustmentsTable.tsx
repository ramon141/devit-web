import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { RentalAdjustmentWithRelations } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

type GeneratedAdjustmentsTableProps = {
  adjustments: RentalAdjustmentWithRelations[]
}

function GeneratedAdjustmentsTable({ adjustments }: GeneratedAdjustmentsTableProps) {
  if (adjustments.length === 0) return null

  const columns: DataTableColumn<RentalAdjustmentWithRelations>[] = [
    {
      header: 'Contratto',
      cell: (adjustment) => (
        <span className="font-medium">{adjustment.rentalContract?.number ?? '—'}</span>
      ),
    },
    { header: 'Indice %', cell: (adjustment) => `${adjustment.indexPercent}%` },
    { header: 'Valore precedente', cell: (adjustment) => formatAmount(adjustment.oldAmount) },
    { header: 'Nuovo valore', cell: (adjustment) => formatAmount(adjustment.newAmount) },
    { header: 'Data', cell: (adjustment) => formatDate(adjustment.effectiveDate) },
  ]

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium">Ultimi adeguamenti generati</p>

      <DataTable
        columns={columns}
        data={adjustments}
        keyExtractor={(adjustment) => adjustment.id ?? ''}
        emptyMessage=""
      />
    </div>
  )
}

export default GeneratedAdjustmentsTable
