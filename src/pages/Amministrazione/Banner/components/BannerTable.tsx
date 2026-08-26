import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('amministrazione')
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
        emptyMessage={t('bannerTable.empty')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('bannerTable.deleteTitle')}
        description={t('bannerTable.deleteDescription', { title: deleteTarget?.title })}
        variant="destructive"
        confirmLabel={t('bannerTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default BannerTable
