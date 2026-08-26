import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { HomeBanner } from '@/api/generated/models'
import { useBannerList } from '@/pages/Amministrazione/Banner/hooks/useBannerList'
import { useEditModalState } from '@/hooks/useEditModalState'
import BannerTable from '@/pages/Amministrazione/Banner/components/BannerTable'
import BannerFormModal from '@/pages/Amministrazione/Banner/components/BannerFormModal'

function Banner() {
  const { t } = useTranslation('amministrazione')
  const { banners, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBannerList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<HomeBanner>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('banner.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('banner.newLabel')}
      />

      <BannerTable banners={banners} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <BannerFormModal open={open} onOpenChange={setOpen} banner={editing} />
    </div>
  )
}

export default Banner
