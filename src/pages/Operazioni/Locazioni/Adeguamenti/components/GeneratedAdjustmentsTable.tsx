import { useTranslation } from 'react-i18next'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { RentalAdjustmentWithRelations } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

type GeneratedAdjustmentsTableProps = {
  adjustments: RentalAdjustmentWithRelations[]
}

function GeneratedAdjustmentsTable({ adjustments }: GeneratedAdjustmentsTableProps) {
  const { t } = useTranslation('operazioni')

  if (adjustments.length === 0) return null

  const columns: DataTableColumn<RentalAdjustmentWithRelations>[] = [
    {
      header: t('locazioni.adeguamenti.generatedTable.contratto'),
      cell: (adjustment) => (
        <span className="font-medium">{adjustment.rentalContract?.number ?? '—'}</span>
      ),
    },
    {
      header: t('locazioni.adeguamenti.generatedTable.indicePercent'),
      cell: (adjustment) => `${adjustment.indexPercent}%`,
    },
    {
      header: t('locazioni.adeguamenti.generatedTable.valorePrecedente'),
      cell: (adjustment) => formatAmount(adjustment.oldAmount),
    },
    {
      header: t('locazioni.adeguamenti.generatedTable.nuovoValore'),
      cell: (adjustment) => formatAmount(adjustment.newAmount),
    },
    {
      header: t('locazioni.adeguamenti.generatedTable.data'),
      cell: (adjustment) => formatDate(adjustment.effectiveDate),
    },
  ]

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium">{t('locazioni.adeguamenti.generatedTable.title')}</p>

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
