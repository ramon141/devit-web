import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { SaleWithRelations } from '@/api/generated/models'
import { useDeleteSale } from '@/pages/Operazioni/Vendite/hooks/useDeleteSale'
import { buildSaleTableColumns } from '@/pages/Operazioni/Vendite/components/SaleTableColumns'

type SaleTableProps = {
  sales: SaleWithRelations[]
  isLoading: boolean
  onEdit: (sale: SaleWithRelations) => void
}

function SaleTable({ sales, isLoading, onEdit }: SaleTableProps) {
  const { t } = useTranslation('operazioni')
  const [deleteTarget, setDeleteTarget] = useState<SaleWithRelations | null>(null)
  const { handleDelete } = useDeleteSale()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildSaleTableColumns({ onEdit, onDelete: setDeleteTarget }, t)

  return (
    <>
      <DataTable
        columns={columns}
        data={sales}
        keyExtractor={(sale) => sale.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('vendite.table.emptyMessage')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('vendite.table.deleteTitle')}
        description={t('vendite.table.deleteDescription', { number: deleteTarget?.number })}
        variant="destructive"
        confirmLabel={t('vendite.table.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default SaleTable
