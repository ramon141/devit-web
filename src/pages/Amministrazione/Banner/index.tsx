import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { HomeBanner } from '@/api/generated/models'
import { useBannerList } from '@/pages/Amministrazione/Banner/hooks/useBannerList'
import BannerTable from '@/pages/Amministrazione/Banner/components/BannerTable'
import BannerFormModal from '@/pages/Amministrazione/Banner/components/BannerFormModal'

function Banner() {
  const { banners, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBannerList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null)

  function handleNew() {
    setEditingBanner(null)
    setFormOpen(true)
  }

  function handleEdit(banner: HomeBanner) {
    setEditingBanner(banner)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca un banner..."
        onNewClick={handleNew}
        newLabel="Nuovo banner"
      />

      <BannerTable banners={banners} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <BannerFormModal open={formOpen} onOpenChange={setFormOpen} banner={editingBanner} />
    </div>
  )
}

export default Banner
