import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useBannerList } from '@/pages/Amministrazione/Banner/hooks/useBannerList'
import { useBannerListTour } from '@/pages/Amministrazione/Banner/hooks/useBannerListTour'
import BannerCarousel from '@/pages/Amministrazione/Banner/components/BannerCarousel'

const LIST_PATH = '/gestionale/amministrazione/banner'

function Banner() {
  const { t } = useTranslation('amministrazione')
  const navigate = useNavigate()
  const { banners, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBannerList()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useBannerListTour()

  return (
    <div>
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('banner.searchPlaceholder')}
        onNewClick={() => navigate(`${LIST_PATH}/nuovo`)}
        newLabel={t('banner.newLabel')}
        searchWrapperId="banner-search-filter"
        newButtonId="banner-new-btn"
      />

      <div id="banner-carousel">
        <BannerCarousel
          banners={banners}
          isLoading={isLoading}
          onEdit={(banner) => navigate(`${LIST_PATH}/${banner.id}`)}
          onCreate={() => navigate(`${LIST_PATH}/nuovo`)}
        />
      </div>

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
