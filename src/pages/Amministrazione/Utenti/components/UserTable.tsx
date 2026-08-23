import { useState } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useBranchControllerFind } from '@/api/generated/api'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { accessLevelOptions } from '@/pages/Amministrazione/Utenti/schemas/userSchema'
import { useDeleteUser } from '@/pages/Amministrazione/Utenti/hooks/useDeleteUser'

type UserTableProps = {
  users: UserExcludingPasswordHashWithRelations[]
  isLoading: boolean
  onEdit: (user: UserExcludingPasswordHashWithRelations) => void
}

function accessLevelLabel(accessLevel: string) {
  return accessLevelOptions.find((option) => option.value === accessLevel)?.label ?? accessLevel
}

function UserTable({ users, isLoading, onEdit }: UserTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<UserExcludingPasswordHashWithRelations | null>(
    null
  )
  const { handleDelete } = useDeleteUser()
  const { data: branches } = useBranchControllerFind({ filter: {} })
  const branchNameById = new Map((branches ?? []).map((branch) => [branch.id, branch.name]))

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Livello</TableHead>
            <TableHead>Filiale</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                Nessun utente trovato.
              </TableCell>
            </TableRow>
          )}

          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{accessLevelLabel(user.accessLevel)}</Badge>
              </TableCell>
              <TableCell>{branchNameById.get(user.branchId ?? '') ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={user.active ? 'default' : 'secondary'}>
                  {user.active ? 'Attivo' : 'Inattivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(user)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(user)}>
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare l'utente?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.fullName}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default UserTable
