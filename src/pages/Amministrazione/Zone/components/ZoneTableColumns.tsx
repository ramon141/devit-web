import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { Zone } from '@/api/generated/models'
import i18n from '@/i18n'

type BuildZoneTableColumnsProps = {
  onEdit: (zone: Zone) => void
  onDelete: (zone: Zone) => void
  onSelect: (zone: Zone) => void
  selectedZoneId?: string
}

export function buildZoneTableColumns({
  onEdit,
  onDelete,
  onSelect,
  selectedZoneId,
}: BuildZoneTableColumnsProps): DataTableColumn<Zone>[] {
  const t = (key: string) => i18n.t(`amministrazione:${key}`)

  return [
    {
      header: t('zoneTableColumns.name'),
      cell: (zone) => (
        <button
          type="button"
          onClick={() => onSelect(zone)}
          className={
            zone.id === selectedZoneId
              ? 'font-semibold underline underline-offset-4'
              : 'font-medium hover:underline hover:underline-offset-4'
          }
        >
          {zone.name}
        </button>
      ),
    },
    { header: t('zoneTableColumns.city'), cell: (zone) => zone.city },
    { header: t('zoneTableColumns.region'), cell: (zone) => zone.region ?? '—' },
    {
      header: t('zoneTableColumns.status'),
      cell: (zone) => (
        <Badge variant={zone.active ? 'default' : 'secondary'}>
          {zone.active ? t('zoneTableColumns.active') : t('zoneTableColumns.inactive')}
        </Badge>
      ),
    },
    {
      header: t('zoneTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (zone) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(zone)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(zone)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
