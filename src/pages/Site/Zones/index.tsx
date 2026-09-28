import { Link } from 'react-router'
import { formatNumber, useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import type { SiteZone } from '@/lib/site/types'
import Room from '@/pages/Site/components/Room'
import { useMotionReady } from '@/pages/Site/hooks/useMotionReady'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import { useZones } from '@/pages/Site/hooks/useSiteData'

// Zonas agrupadas pela cidade, na ordem em que a API as devolve
function groupByCity(zones: SiteZone[]) {
  const groups = new Map<string, SiteZone[]>()

  for (const zone of zones) {
    const city = zone.city ?? ''
    groups.set(city, [...(groups.get(city) ?? []), zone])
  }

  return [...groups.entries()]
}

function Zones() {
  const { dict, locale } = useSiteDict()
  const { data } = useZones()

  usePageMeta(dict.home.zonesTitle, dict.home.zonesLead)
  useMotionReady(!!data)

  return (
    <div className="py-14">
      <Room className="pb-4">
        <div className="container-devit">
          <p className="eyebrow">{dict.home.zonesLabel}</p>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">{dict.home.zonesTitle}</h1>
          <p className="mt-4 max-w-[58ch] text-site-ink-soft">{dict.home.zonesLead}</p>
        </div>
      </Room>

      {groupByCity(data ?? []).map(([city, zones]) => (
        <Room key={city} className="mt-12 pt-2">
          <div className="container-devit">
            <h2 className="mb-6 border-b border-site-line pb-4 font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-ink">
              {city}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {zones.map((zone) => (
                <li key={zone.slug}>
                  <Link
                    to={SITE_PATHS.zone(zone.slug ?? '')}
                    className="group flex items-baseline justify-between gap-4 rounded-xl border border-site-line bg-white px-6 py-5 transition-colors hover:border-site-accent-deep"
                  >
                    <span className="font-site-display text-[1.5rem] leading-none">{zone.name}</span>
                    <span className="font-site-mono text-[0.72rem] text-site-muted group-hover:text-site-accent-deep">
                      {formatNumber(zone.propertiesCount, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Room>
      ))}
    </div>
  )
}

export default Zones
