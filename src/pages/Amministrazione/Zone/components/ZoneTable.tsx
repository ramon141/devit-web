import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { Zone } from '@/api/generated/models'
import { useDeleteZone } from '@/pages/Amministrazione/Zone/hooks/useDeleteZone'
import { buildZoneTableColumns } from '@/pages/Amministrazione/Zone/components/ZoneTableColumns'

type ZoneTableProps = {
  zones: Zone[]
  isLoading: boolean
  onEdit: (zone: Zone) => void
  onSelect: (zone: Zone) => void
  selectedZoneId?: string
}

function ZoneTable({ zones, isLoading, onEdit, onSelect, selectedZoneId }: ZoneTableProps) {
  const { t } = useTranslation('amministrazione')
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null)
  const { handleDelete } = useDeleteZone()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildZoneTableColumns({
    onEdit,
    onDelete: setDeleteTarget,
    onSelect,
    selectedZoneId,
  })

  return (
    <>
      <div id="zone-table">
        <DataTable
          columns={columns}
          data={zones}
          keyExtractor={(zone) => zone.id ?? ''}
          isLoading={isLoading}
          emptyMessage={t('zoneTable.empty')}
        />
      </div>

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('zoneTable.deleteTitle')}
        description={t('zoneTable.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('zoneTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default ZoneTable
