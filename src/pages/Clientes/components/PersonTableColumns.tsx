import { Link } from 'react-router'
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import type { TFunction } from 'i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PersonWithRelations } from '@/api/generated/models'
import { getPersonRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { getOptionLabel } from '@/utils/getOptionLabel'

type BuildPersonTableColumnsProps = {
  t: TFunction<'clientes'>
  onEdit: (person: PersonWithRelations) => void
  onDelete: (person: PersonWithRelations) => void
}

export function buildPersonTableColumns({
  t,
  onEdit,
  onDelete,
}: BuildPersonTableColumnsProps): DataTableColumn<PersonWithRelations>[] {
  const personRoleOptions = getPersonRoleOptions(t)

  return [
    {
      header: t('personTableColumns.name'),
      cell: (person) => <span className="font-medium">{person.name}</span>,
    },
    {
      header: t('personTableColumns.role'),
      cell: (person) => (
        <Badge variant="secondary">{getOptionLabel(personRoleOptions, person.role)}</Badge>
      ),
    },
    { header: t('personTableColumns.email'), cell: (person) => person.email ?? '—' },
    { header: t('personTableColumns.phone'), cell: (person) => person.phone ?? '—' },
    {
      header: t('personTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (person) => (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link to={`${CRM_BASE_PATH}/clienti/${person.id}`} />}
          >
            <EyeIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(person)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(person)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
