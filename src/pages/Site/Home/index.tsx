import { useSiteDict } from '@/lib/site/dict'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import {
  useBranches,
  useFeaturedProperties,
  useMapPins,
  usePropertyList,
} from '@/pages/Site/hooks/useSiteData'
import { useMotionReady } from '@/pages/Site/hooks/useMotionReady'
import FeaturedSection from '@/pages/Site/Home/components/FeaturedSection'
import HomeHero from '@/pages/Site/Home/components/HomeHero'
import MapSection from '@/pages/Site/Home/components/MapSection'
import SellSection from '@/pages/Site/Home/components/SellSection'
import ZonesSection from '@/pages/Site/Home/components/ZonesSection'

function SiteHome() {
  const { dict } = useSiteDict()
  const featured = useFeaturedProperties(6)
  const all = usePropertyList({ limit: 1 })
  const branches = useBranches()
  const { pins, isSuccess: mapReady } = useMapPins()

  usePageMeta(`${dict.home.heroTitle} ${dict.home.heroTitleEm}`, dict.home.heroLead)
  useMotionReady(!!featured.data && !!all.data && !!branches.data && mapReady)

  return (
    <>
      <HomeHero total={all.data?.total ?? 0} offices={branches.data?.length ?? 0} />
      <FeaturedSection properties={featured.data ?? []} />
      <ZonesSection />
      <MapSection pins={pins} />
      <SellSection />
    </>
  )
}

export default SiteHome
