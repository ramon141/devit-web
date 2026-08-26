import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PropertyCategory } from '@/api/generated/models'

type BuildCategoryTableColumnsProps = {
  onEdit: (category: PropertyCategory) => void
  onDelete: (category: PropertyCategory) => void
}

export function buildCategoryTableColumns({
  onEdit,
  onDelete,
}: BuildCategoryTableColumnsProps): DataTableColumn<PropertyCategory>[] {
  return [
    { header: 'Nome', cell: (category) => <span className="font-medium">{category.name}</span> },
    { header: 'Slug', cell: (category) => category.slug },
    { header: 'Ordine', cell: (category) => category.displayOrder ?? '—' },
    {
      header: 'Stato',
      cell: (category) => (
        <Badge variant={category.active ? 'default' : 'secondary'}>
          {category.active ? 'Attiva' : 'Inattiva'}
        </Badge>
      ),
    },
    {
      header: 'Azioni',
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
