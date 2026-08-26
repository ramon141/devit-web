import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { Branch } from '@/api/generated/models'
import i18n from '@/i18n'

type BuildBranchTableColumnsProps = {
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
}

export function buildBranchTableColumns({
  onEdit,
  onDelete,
}: BuildBranchTableColumnsProps): DataTableColumn<Branch>[] {
  const t = (key: string) => i18n.t(`amministrazione:${key}`)

  return [
    {
      header: t('branchTableColumns.name'),
      cell: (branch) => <span className="font-medium">{branch.name}</span>,
    },
    {
      header: t('branchTableColumns.status'),
      cell: (branch) => (
        <Badge variant={branch.active ? 'default' : 'secondary'}>
          {branch.active ? t('branchTableColumns.active') : t('branchTableColumns.inactive')}
        </Badge>
      ),
    },
    {
      header: t('branchTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (branch) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(branch)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(branch)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
