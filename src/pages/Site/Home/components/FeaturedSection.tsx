import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import type { SiteCard } from '@/lib/site/types'
import PropertyCard from '@/pages/Site/components/PropertyCard'
import Room from '@/pages/Site/components/Room'

function FeaturedSection({ properties }: { properties: SiteCard[] }) {
  const { dict } = useSiteDict()

  return (
    <Room className="py-20" decor="right">
      <div className="container-devit">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-site-line pb-6">
          <div>
            <p className="eyebrow">{dict.home.featuredLabel}</p>
            <h2 data-split className="mt-3 text-[clamp(2rem,4vw,3rem)]">
              {dict.home.featuredTitle}
            </h2>
          </div>
          <Link
            to={SITE_PATHS.properties}
            className="text-[0.95rem] font-semibold text-site-ink underline decoration-site-accent decoration-2 underline-offset-4 transition-colors hover:text-site-accent-deep"
          >
            {dict.home.ctaExplore} →
          </Link>
        </header>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} priority={index < 3} />
          ))}
        </div>
      </div>
    </Room>
  )
}

export default FeaturedSection
