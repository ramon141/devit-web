import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useNeighborhoodControllerFind } from '@/api/generated/api'
import type { Neighborhood, Zone } from '@/api/generated/models'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useDeleteNeighborhood } from '@/pages/Amministrazione/Zone/hooks/useDeleteNeighborhood'
import NeighborhoodFormModal from '@/pages/Amministrazione/Zone/components/NeighborhoodFormModal'

type NeighborhoodPanelProps = {
  zone: Zone
}

function NeighborhoodPanel({ zone }: NeighborhoodPanelProps) {
  const { t } = useTranslation('amministrazione')
  const [deleteTarget, setDeleteTarget] = useState<Neighborhood | null>(null)
  const { handleDelete } = useDeleteNeighborhood()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<Neighborhood>()

  const { data: neighborhoods } = useNeighborhoodControllerFind({
    filter: { where: { zoneId: zone.id }, order: ['name ASC'] },
  })

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {t('neighborhoodPanel.title', { zone: `${zone.city} - ${zone.name}` })}
        </h3>

        <Button size="sm" onClick={openNew} className="gap-1.5">
          <PlusIcon className="size-4" />
          {t('neighborhoodPanel.newLabel')}
        </Button>
      </div>

      {(neighborhoods ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">{t('neighborhoodPanel.empty')}</p>
      )}

      <ul className="grid gap-1">
        {(neighborhoods ?? []).map((neighborhood) => (
          <li
            key={neighborhood.id}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
          >
            <span className="flex items-center gap-2 text-sm">
              {neighborhood.name}
              {!neighborhood.active && (
                <Badge variant="secondary">{t('neighborhoodPanel.inactive')}</Badge>
              )}
            </span>

            <span className="flex shrink-0">
              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(neighborhood)}>
                <PencilIcon className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(neighborhood)}>
                <Trash2Icon className="size-4 text-destructive" />
              </Button>
            </span>
          </li>
        ))}
      </ul>

      <NeighborhoodFormModal
        open={open}
        onOpenChange={setOpen}
        zoneId={zone.id ?? ''}
        neighborhood={editing}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
        title={t('neighborhoodPanel.deleteTitle')}
        description={t('neighborhoodPanel.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('neighborhoodPanel.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default NeighborhoodPanel
