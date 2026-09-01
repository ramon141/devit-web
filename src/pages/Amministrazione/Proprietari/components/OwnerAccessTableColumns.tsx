import { RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type { DataTableColumn } from '@/components/DataTable'
import { formatDateTime } from '@/utils/formatDate'
import type { OwnerPortalAccess } from '@/pages/Amministrazione/Proprietari/types'
import i18n from '@/i18n'

type BuildOwnerAccessTableColumnsProps = {
  onResetPin: (access: OwnerPortalAccess) => void
  onToggleActive: (access: OwnerPortalAccess, active: boolean) => void
}

export function buildOwnerAccessTableColumns({
  onResetPin,
  onToggleActive,
}: BuildOwnerAccessTableColumnsProps): DataTableColumn<OwnerPortalAccess>[] {
  const t = (key: string) => i18n.t(`amministrazione:${key}`)

  return [
    {
      header: t('proprietari.tableColumns.owner'),
      cell: (access) => <span className="font-medium">{access.person?.name ?? '—'}</span>,
    },
    {
      header: t('proprietari.tableColumns.email'),
      cell: (access) => access.email,
    },
    {
      header: t('proprietari.tableColumns.properties'),
      cell: (access) => access.propertiesCount ?? 0,
    },
    {
      header: t('proprietari.tableColumns.lastAccess'),
      cell: (access) => (access.lastAccessAt ? formatDateTime(access.lastAccessAt) : '—'),
    },
    {
      header: t('proprietari.tableColumns.accessCount'),
      cell: (access) => access.accessCount ?? 0,
    },
    {
      header: t('proprietari.tableColumns.status'),
      cell: (access) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={access.active ?? false}
            onCheckedChange={(checked) => onToggleActive(access, checked)}
          />
          <Badge variant={access.active ? 'default' : 'secondary'}>
            {access.active ? t('proprietari.tableColumns.active') : t('proprietari.tableColumns.inactive')}
          </Badge>
        </div>
      ),
    },
    {
      header: t('proprietari.tableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (access) => (
        <Button variant="ghost" size="icon-sm" onClick={() => onResetPin(access)}>
          <RotateCcwIcon className="size-4" />
        </Button>
      ),
    },
  ]
}
