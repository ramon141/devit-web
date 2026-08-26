import { Link } from 'react-router'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import type { PropertyWithRelations } from '@/api/generated/models'
import { statusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { formatAmount } from '@/utils/formatAmount'
import { getOptionLabel } from '@/utils/getOptionLabel'

type BuildPropertyTableColumnsProps = {
  onDelete: (property: PropertyWithRelations) => void
}

export function buildPropertyTableColumns({
  onDelete,
}: BuildPropertyTableColumnsProps): DataTableColumn<PropertyWithRelations>[] {
  return [
    { header: 'Codice', cell: (property) => <span className="font-medium">{property.code}</span> },
    { header: 'Titolo', cell: (property) => property.title },
    { header: 'Città', cell: (property) => property.address?.city ?? '—' },
    { header: 'Proprietario', cell: (property) => property.owner?.name ?? '—' },
    { header: 'Prezzo', cell: (property) => formatAmount(property.salePrice ?? property.rentPrice) },
    {
      header: 'Stato',
      cell: (property) => (
        <Badge variant="secondary">{getOptionLabel(statusOptions, property.status)}</Badge>
      ),
    },
    {
      header: 'Azioni',
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (property) => (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link to={`${CRM_BASE_PATH}/proprieta/${property.id}`} />}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(property)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
