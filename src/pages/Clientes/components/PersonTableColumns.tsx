import { Link } from 'react-router'
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PersonWithRelations } from '@/api/generated/models'
import { personRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

function roleLabel(role: string) {
  return personRoleOptions.find((option) => option.value === role)?.label ?? role
}

type BuildPersonTableColumnsProps = {
  onEdit: (person: PersonWithRelations) => void
  onDelete: (person: PersonWithRelations) => void
}

export function buildPersonTableColumns({
  onEdit,
  onDelete,
}: BuildPersonTableColumnsProps): DataTableColumn<PersonWithRelations>[] {
  return [
    { header: 'Nome', cell: (person) => <span className="font-medium">{person.name}</span> },
    {
      header: 'Ruolo',
      cell: (person) => <Badge variant="secondary">{roleLabel(person.role)}</Badge>,
    },
    { header: 'E-mail', cell: (person) => person.email ?? '—' },
    { header: 'Telefono', cell: (person) => person.phone ?? '—' },
    {
      header: 'Azioni',
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
