import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { HomeBanner } from '@/api/generated/models'
import { useDeleteBanner } from '@/pages/Amministrazione/Banner/hooks/useDeleteBanner'
import { buildBannerTableColumns } from '@/pages/Amministrazione/Banner/components/BannerTableColumns'

type BannerTableProps = {
  banners: HomeBanner[]
  isLoading: boolean
  onEdit: (banner: HomeBanner) => void
}

function BannerTable({ banners, isLoading, onEdit }: BannerTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<HomeBanner | null>(null)
  const { handleDelete } = useDeleteBanner()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildBannerTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={banners}
        keyExtractor={(banner) => banner.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun banner trovato."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare il banner?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.title}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default BannerTable
