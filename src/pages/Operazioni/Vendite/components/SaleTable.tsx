import { useState } from 'react'
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
  const [deleteTarget, setDeleteTarget] = useState<SaleWithRelations | null>(null)
  const { handleDelete } = useDeleteSale()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildSaleTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={sales}
        keyExtractor={(sale) => sale.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessuna vendita trovata."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la vendita?"
        description={`Questa azione eliminerà definitivamente la vendita "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default SaleTable
