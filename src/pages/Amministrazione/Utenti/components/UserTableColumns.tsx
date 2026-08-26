import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { accessLevelOptions } from '@/pages/Amministrazione/Utenti/schemas/userSchema'
import { getOptionLabel } from '@/utils/getOptionLabel'
import i18n from '@/i18n'

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
  const t = (key: string) => i18n.t(`amministrazione:${key}`)

  return [
    {
      header: t('userTableColumns.name'),
      cell: (user) => <span className="font-medium">{user.fullName}</span>,
    },
    { header: t('userTableColumns.email'), cell: (user) => user.email },
    {
      header: t('userTableColumns.level'),
      cell: (user) => (
        <Badge variant="secondary">{getOptionLabel(accessLevelOptions, user.accessLevel)}</Badge>
      ),
    },
    {
      header: t('userTableColumns.branch'),
      cell: (user) => branchNameById.get(user.branchId ?? '') ?? '—',
    },
    {
      header: t('userTableColumns.status'),
      cell: (user) => (
        <Badge variant={user.active ? 'default' : 'secondary'}>
          {user.active ? t('userTableColumns.active') : t('userTableColumns.inactive')}
        </Badge>
      ),
    },
    {
      header: t('userTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (user) => <UserTableActions user={user} onEdit={onEdit} onDelete={onDelete} />,
    },
  ]
}
