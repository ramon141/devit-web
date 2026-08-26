import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import { useBranchControllerFind } from '@/api/generated/api'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useDeleteUser } from '@/pages/Amministrazione/Utenti/hooks/useDeleteUser'
import { buildUserTableColumns } from '@/pages/Amministrazione/Utenti/components/UserTableColumns'

type UserTableProps = {
  users: UserExcludingPasswordHashWithRelations[]
  isLoading: boolean
  onEdit: (user: UserExcludingPasswordHashWithRelations) => void
}

function UserTable({ users, isLoading, onEdit }: UserTableProps) {
  const [deleteTarget, setDeleteTarget] =
    useState<UserExcludingPasswordHashWithRelations | null>(null)
  const { handleDelete } = useDeleteUser()
  const { data: branches } = useBranchControllerFind({ filter: {} })
  const branchNameById = new Map((branches ?? []).map((branch) => [branch.id, branch.name]))

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildUserTableColumns({
    branchNameById,
    onEdit,
    onDelete: setDeleteTarget,
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun utente trovato."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare l'utente?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.fullName}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default UserTable
