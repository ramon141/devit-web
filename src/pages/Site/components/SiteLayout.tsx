import { Fragment } from 'react'
import { Outlet } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import Atmosphere from '@/pages/Site/components/Atmosphere'
import CookieBanner from '@/pages/Site/components/CookieBanner'
import HouseLights from '@/pages/Site/components/HouseLights'
import SiteFooter from '@/pages/Site/components/SiteFooter'
import SiteHeader from '@/pages/Site/components/SiteHeader'

const SKIP_LINK =
  'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] ' +
  'focus:rounded focus:bg-site-accent focus:px-4 focus:py-2 focus:font-medium focus:text-site-ink'

function SiteLayout() {
  const { dict, locale } = useSiteDict()

  return (
    <div className="site-root">
      <a href="#main" className={SKIP_LINK}>
        {dict.common.skipToContent}
      </a>

      <SiteHeader />

      <main id="main">
        {/* remonta a página ao trocar de idioma: os títulos divididos pelo SplitText não se atualizam sozinhos */}
        <Fragment key={locale}>
          <Outlet />
        </Fragment>
      </main>

      <SiteFooter />
      <Atmosphere />
      <HouseLights />
      <CookieBanner />
    </div>
  )
}

export default SiteLayout
