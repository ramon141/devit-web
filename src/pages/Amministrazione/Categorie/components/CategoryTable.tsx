import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('amministrazione')
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
        emptyMessage={t('categoryTable.empty')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('categoryTable.deleteTitle')}
        description={t('categoryTable.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('categoryTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default CategoryTable
