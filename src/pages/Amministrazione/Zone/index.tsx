import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { Zone } from '@/api/generated/models'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useZoneList } from '@/pages/Amministrazione/Zone/hooks/useZoneList'
import ZoneTable from '@/pages/Amministrazione/Zone/components/ZoneTable'
import ZoneFormModal from '@/pages/Amministrazione/Zone/components/ZoneFormModal'
import NeighborhoodPanel from '@/pages/Amministrazione/Zone/components/NeighborhoodPanel'

function ZonePage() {
  const { t } = useTranslation('amministrazione')
  const { zones, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useZoneList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<Zone>()
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)

  return (
    <div className="grid gap-4">
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('zone.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('zone.newLabel')}
      />

      <ZoneTable
        zones={zones}
        isLoading={isLoading}
        onEdit={openEdit}
        onSelect={setSelectedZone}
        selectedZoneId={selectedZone?.id}
      />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      {selectedZone && <NeighborhoodPanel zone={selectedZone} />}

      <ZoneFormModal open={open} onOpenChange={setOpen} zone={editing} />
    </div>
  )
}

export default ZonePage
