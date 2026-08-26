import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { PersonWithRelations } from '@/api/generated/models'
import { useDeletePerson } from '@/pages/Clientes/hooks/useDeletePerson'
import { buildPersonTableColumns } from '@/pages/Clientes/components/PersonTableColumns'

type PersonTableProps = {
  people: PersonWithRelations[]
  isLoading: boolean
  onEdit: (person: PersonWithRelations) => void
}

function PersonTable({ people, isLoading, onEdit }: PersonTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PersonWithRelations | null>(null)
  const { handleDelete } = useDeletePerson()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildPersonTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={people}
        keyExtractor={(person) => person.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun cliente trovato."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare il cliente?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default PersonTable
