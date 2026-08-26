import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PropertyCategory } from '@/api/generated/models'
import i18n from '@/i18n'

type BuildCategoryTableColumnsProps = {
  onEdit: (category: PropertyCategory) => void
  onDelete: (category: PropertyCategory) => void
}

export function buildCategoryTableColumns({
  onEdit,
  onDelete,
}: BuildCategoryTableColumnsProps): DataTableColumn<PropertyCategory>[] {
  const t = (key: string) => i18n.t(`amministrazione:${key}`)

  return [
    {
      header: t('categoryTableColumns.name'),
      cell: (category) => <span className="font-medium">{category.name}</span>,
    },
    { header: t('categoryTableColumns.slug'), cell: (category) => category.slug },
    { header: t('categoryTableColumns.order'), cell: (category) => category.displayOrder ?? '—' },
    {
      header: t('categoryTableColumns.status'),
      cell: (category) => (
        <Badge variant={category.active ? 'default' : 'secondary'}>
          {category.active ? t('categoryTableColumns.active') : t('categoryTableColumns.inactive')}
        </Badge>
      ),
    },
    {
      header: t('categoryTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (category) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(category)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
