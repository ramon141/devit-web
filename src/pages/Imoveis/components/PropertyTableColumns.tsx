import { Link } from 'react-router'
import type { TFunction } from 'i18next'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import type { PropertyWithRelations } from '@/api/generated/models'
import { getStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { formatAmount } from '@/utils/formatAmount'
import { getOptionLabel } from '@/utils/getOptionLabel'
import { formatDate } from '@/utils/formatDate'

function formatPropertySize(property: PropertyWithRelations): string {
  const parts: string[] = []
  if (property.areaSqm) parts.push(`${property.areaSqm} m²`)
  if (property.bedrooms) parts.push(`${property.bedrooms} cam.`)
  if (property.bathrooms) parts.push(`${property.bathrooms} bg.`)

  return parts.length > 0 ? parts.join(' · ') : '—'
}

type BuildPropertyTableColumnsProps = {
  t: TFunction<'imoveis'>
  onDelete: (property: PropertyWithRelations) => void
}

export function buildPropertyTableColumns({
  t,
  onDelete,
}: BuildPropertyTableColumnsProps): DataTableColumn<PropertyWithRelations>[] {
  return [
    { header: t('table.columns.code'), cell: (property) => <span className="font-medium">{property.code}</span> },
    { header: t('table.columns.title'), cell: (property) => property.title },
    { header: t('table.columns.category'), cell: (property) => property.category?.name ?? '—' },
    { header: t('table.columns.city'), cell: (property) => property.address?.city ?? '—' },
    { header: t('table.columns.size'), cell: (property) => formatPropertySize(property) },
    { header: t('table.columns.owner'), cell: (property) => property.owner?.name ?? '—' },
    { header: t('table.columns.price'), cell: (property) => formatAmount(property.salePrice ?? property.rentPrice) },
    {
      header: t('table.columns.status'),
      cell: (property) => (
        <Badge variant="secondary">{getOptionLabel(getStatusOptions(t), property.status)}</Badge>
      ),
    },
    { header: t('table.columns.updatedAt'), cell: (property) => formatDate(property.updatedAt) },
    {
      header: t('table.columns.actions'),
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
