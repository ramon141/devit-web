import type { TFunction } from 'i18next'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PersonWithRelations } from '@/api/generated/models'
import { getPersonRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import PersonActionsMenu, {
  type PersonActionHandlers,
} from '@/pages/Clientes/components/PersonActionsMenu'
import { formatBroker } from '@/utils/formatBroker'
import { getOptionLabel } from '@/utils/getOptionLabel'

type BuildPersonTableColumnsProps = {
  t: TFunction<'clientes'>
  handlers: PersonActionHandlers
}

export function buildPersonTableColumns({
  t,
  handlers,
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
      header: t('personTableColumns.responsibleBroker'),
      cell: (person) => formatBroker(person.responsibleBroker),
    },
    {
      header: t('personTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (person) => <PersonActionsMenu person={person} {...handlers} />,
    },
  ]
}
