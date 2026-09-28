import { useSiteDict } from '@/lib/site/dict'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import AboutHero from '@/pages/Site/ChiSiamo/components/AboutHero'
import Founders from '@/pages/Site/ChiSiamo/components/Founders'
import OfficesSection from '@/pages/Site/ChiSiamo/components/OfficesSection'

function ChiSiamo() {
  const { dict } = useSiteDict()

  usePageMeta(`${dict.about.title} ${dict.about.titleEm}`, dict.about.lead)

  return (
    <>
      <AboutHero />
      <Founders />
      <OfficesSection />
    </>
  )
}

export default ChiSiamo
