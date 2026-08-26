import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { PropertyCategory } from '@/api/generated/models'
import { useDeleteCategory } from '@/pages/Amministrazione/Categorie/hooks/useDeleteCategory'
import { buildCategoryTableColumns } from '@/pages/Amministrazione/Categorie/components/CategoryTableColumns'

type CategoryTableProps = {
  categories: PropertyCategory[]
  isLoading: boolean
  onEdit: (category: PropertyCategory) => void
}

function CategoryTable({ categories, isLoading, onEdit }: CategoryTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PropertyCategory | null>(null)
  const { handleDelete } = useDeleteCategory()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildCategoryTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(category) => category.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessuna categoria trovata."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la categoria?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default CategoryTable
