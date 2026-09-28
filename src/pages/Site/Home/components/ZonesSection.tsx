import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import Room from '@/pages/Site/components/Room'
import { useZones } from '@/pages/Site/hooks/useSiteData'

function ZonesSection() {
  const { dict } = useSiteDict()
  const { data: zones } = useZones()

  return (
    <Room tone="cream" className="py-20" decor="left">
      <div className="container-devit">
        <p className="eyebrow">{dict.home.zonesLabel}</p>
        <h2 data-split className="mt-3 text-[clamp(2rem,4vw,3rem)]">
          {dict.home.zonesTitle}
        </h2>
        <p className="mt-4 max-w-[58ch] text-site-ink-soft">{dict.home.zonesLead}</p>

        <ul className="mt-10 flex flex-wrap gap-3">
          {(zones ?? []).map((zone) => (
            <li key={zone.slug}>
              <Link
                to={SITE_PATHS.zone(zone.slug ?? '')}
                className="chip inline-block rounded-full border border-site-line bg-white px-5 py-2.5 text-[0.95rem] text-site-ink transition-colors hover:border-site-accent-deep hover:bg-site-accent"
              >
                {zone.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Room>
  )
}

export default ZonesSection
