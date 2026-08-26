import { useState } from 'react'
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
  const [deleteTarget, setDeleteTarget] = useState<PropertyWithRelations | null>(null)
  const { handleDelete } = useDeleteProperty()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildPropertyTableColumns({ onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={properties}
        keyExtractor={(property) => property.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun immobile trovato."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare l'immobile?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.title}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default PropertyTable
