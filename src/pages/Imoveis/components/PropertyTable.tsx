import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { PropertyWithRelations } from '@/api/generated/models'
import { useDeleteProperty } from '@/pages/Imoveis/hooks/useDeleteProperty'
import { buildPropertyTableColumns } from '@/pages/Imoveis/components/PropertyTableColumns'

type PropertyTableProps = {
  properties: PropertyWithRelations[]
  isLoading: boolean
}

function PropertyTable({ properties, isLoading }: PropertyTableProps) {
  const { t } = useTranslation('imoveis')
  const [deleteTarget, setDeleteTarget] = useState<PropertyWithRelations | null>(null)
  const { handleDelete } = useDeleteProperty()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildPropertyTableColumns({ t, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={properties}
        keyExtractor={(property) => property.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('table.emptyMessage')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('table.deleteTitle')}
        description={t('table.deleteDescription', { title: deleteTarget?.title })}
        variant="destructive"
        confirmLabel={t('table.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default PropertyTable
