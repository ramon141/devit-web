import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { Branch } from '@/api/generated/models'
import { useDeleteBranch } from '@/pages/Amministrazione/Filiali/hooks/useDeleteBranch'
import { buildBranchTableColumns } from '@/pages/Amministrazione/Filiali/components/BranchTableColumns'

type BranchTableProps = {
  branches: Branch[]
  isLoading: boolean
  onEdit: (branch: Branch) => void
}

function BranchTable({ branches, isLoading, onEdit }: BranchTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null)
  const { handleDelete } = useDeleteBranch()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildBranchTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={branches}
        keyExtractor={(branch) => branch.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessuna filiale trovata."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la filiale?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default BranchTable
