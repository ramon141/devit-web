import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { HomeBanner } from '@/api/generated/models'

type BuildBannerTableColumnsProps = {
  onEdit: (banner: HomeBanner) => void
  onDelete: (banner: HomeBanner) => void
}

export function buildBannerTableColumns({
  onEdit,
  onDelete,
}: BuildBannerTableColumnsProps): DataTableColumn<HomeBanner>[] {
  return [
    { header: 'Titolo', cell: (banner) => <span className="font-medium">{banner.title}</span> },
    {
      header: 'Link',
      cellClassName: 'max-w-48 truncate',
      cell: (banner) => banner.targetLink ?? '—',
    },
    { header: 'Ordine', cell: (banner) => banner.displayOrder ?? '—' },
    {
      header: 'Stato',
      cell: (banner) => (
        <Badge variant={banner.active ? 'default' : 'secondary'}>
          {banner.active ? 'Attivo' : 'Inattivo'}
        </Badge>
      ),
    },
    {
      header: 'Azioni',
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (banner) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(banner)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
