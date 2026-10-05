import { Link, useParams } from 'react-router'
import { formatNumber, useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import Breadcrumb from '@/pages/Site/components/Breadcrumb'
import Room from '@/pages/Site/components/Room'
import { useMotionReady } from '@/pages/Site/hooks/useMotionReady'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import { usePropertyList, useZones } from '@/pages/Site/hooks/useSiteData'
import PropertyGrid from '@/pages/Site/Properties/components/PropertyGrid'

const CHIP =
  'inline-block rounded-full border border-site-line bg-white px-5 py-2.5 text-[0.95rem] ' +
  'transition-colors hover:border-site-accent-deep hover:bg-site-accent'
const CTA =
  'inline-block rounded-lg bg-site-ink px-6 py-3 font-semibold text-site-cream ' +
  'transition-colors hover:bg-site-accent hover:text-site-ink'

function ZoneDetail() {
  const { zona = '' } = useParams<{ zona: string }>()
  const { dict, locale } = useSiteDict()
  const { data: zones, isSuccess: zonesReady } = useZones()
  const { data } = usePropertyList({ zone: zona, limit: 12 })
  const zone = zones?.find((item) => item.slug === zona)

  usePageMeta(
    zone ? `${dict.zone.title} ${zone.name}` : undefined,
    zone ? `${dict.zone.lead} ${zone.name}. Devit ${dict.brand.tagline}, ${dict.brand.since}.` : undefined
  )
  useMotionReady(!!data && zonesReady)

  if (!zonesReady) return null

  if (!zone) {
    return (
      <div className="container-devit py-24 text-center">
        <p className="font-site-display text-[1.8rem]">{dict.zone.notFound}</p>
        <Link
          to={SITE_PATHS.zones}
          className="mt-6 inline-block font-semibold underline decoration-site-accent decoration-2 underline-offset-4"
        >
          {dict.zone.backToZones}
        </Link>
      </div>
    )
  }

  const total = data?.total ?? 0
  const others = (zones ?? []).filter((item) => item.slug !== zona && item.city === zone.city)

  return (
    <div className="py-12">
      <Room className="pb-2">
        <div className="container-devit">
          <Breadcrumb
            items={[
              { label: dict.nav.home, to: SITE_PATHS.home },
              { label: dict.nav.zones, to: SITE_PATHS.zones },
              { label: zone.name ?? '' },
            ]}
          />

          <header className="border-b border-site-line pb-8">
            <h1 className="text-[clamp(2.2rem,5vw,3.6rem)]">
              {dict.zone.title} {zone.name}
            </h1>
            <p className="mt-4 max-w-[62ch] text-site-ink-soft">
              <strong className="font-semibold text-site-ink">{formatNumber(total, locale)}</strong>{' '}
              {total === 1 ? dict.zone.countOne : dict.zone.countMany}.
            </p>
          </header>
        </div>
      </Room>

      <Room className="pt-2">
        <div className="container-devit">
          <div className="mt-8">{data && <PropertyGrid items={data.items ?? []} columns="lg" />}</div>

          {data && total > (data.items?.length ?? 0) && (
            <p className="mt-10">
              <Link to={`${SITE_PATHS.properties}?zone=${zona}`} className={CTA}>
                {dict.home.ctaExplore} →
              </Link>
            </p>
          )}
        </div>
      </Room>

      {others.length > 0 && (
        <Room className="mt-20 pt-2">
          <div className="container-devit border-t border-site-line pt-10">
            <h2 className="mb-6 font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-ink">
              {dict.zone.otherZones}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link to={SITE_PATHS.zone(item.slug ?? '')} className={CHIP}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Room>
      )}
    </div>
  )
}

export default ZoneDetail
