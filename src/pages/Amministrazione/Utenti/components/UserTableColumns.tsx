import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { accessLevelOptions } from '@/pages/Amministrazione/Utenti/schemas/userSchema'

function accessLevelLabel(accessLevel: string) {
  return accessLevelOptions.find((option) => option.value === accessLevel)?.label ?? accessLevel
}

type UserTableActionsProps = {
  user: UserExcludingPasswordHashWithRelations
  onEdit: (user: UserExcludingPasswordHashWithRelations) => void
  onDelete: (user: UserExcludingPasswordHashWithRelations) => void
}

function UserTableActions({ user, onEdit, onDelete }: UserTableActionsProps) {
  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(user)}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(user)}>
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </>
  )
}

type BuildUserTableColumnsProps = {
  branchNameById: Map<string | undefined, string | undefined>
  onEdit: (user: UserExcludingPasswordHashWithRelations) => void
  onDelete: (user: UserExcludingPasswordHashWithRelations) => void
}

export function buildUserTableColumns({
  branchNameById,
  onEdit,
  onDelete,
}: BuildUserTableColumnsProps): DataTableColumn<UserExcludingPasswordHashWithRelations>[] {
  return [
    { header: 'Nome', cell: (user) => <span className="font-medium">{user.fullName}</span> },
    { header: 'E-mail', cell: (user) => user.email },
    {
      header: 'Livello',
      cell: (user) => <Badge variant="secondary">{accessLevelLabel(user.accessLevel)}</Badge>,
    },
    {
      header: 'Filiale',
      cell: (user) => branchNameById.get(user.branchId ?? '') ?? '—',
    },
    {
      header: 'Stato',
      cell: (user) => (
        <Badge variant={user.active ? 'default' : 'secondary'}>
          {user.active ? 'Attivo' : 'Inattivo'}
        </Badge>
      ),
    },
    {
      header: 'Azioni',
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (user) => <UserTableActions user={user} onEdit={onEdit} onDelete={onDelete} />,
    },
  ]
}
