import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import { useBannerList } from '@/pages/Amministrazione/Banner/hooks/useBannerList'
import BannerCarousel from '@/pages/Amministrazione/Banner/components/BannerCarousel'

const LIST_PATH = '/gestionale/amministrazione/banner'

function Banner() {
  const { t } = useTranslation('amministrazione')
  const navigate = useNavigate()
  const { banners, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBannerList()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('banner.searchPlaceholder')}
        onNewClick={() => navigate(`${LIST_PATH}/nuovo`)}
        newLabel={t('banner.newLabel')}
      />

      <BannerCarousel
        banners={banners}
        isLoading={isLoading}
        onEdit={(banner) => navigate(`${LIST_PATH}/${banner.id}`)}
        onCreate={() => navigate(`${LIST_PATH}/nuovo`)}
      />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Banner
