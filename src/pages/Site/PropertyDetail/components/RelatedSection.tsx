import { useSiteDict } from '@/lib/site/dict'
import type { SiteCard } from '@/lib/site/types'
import PropertyCard from '@/pages/Site/components/PropertyCard'
import Room from '@/pages/Site/components/Room'

function RelatedSection({ properties }: { properties: SiteCard[] }) {
  const { dict } = useSiteDict()

  if (properties.length === 0) return null

  return (
    <Room className="mt-24 pt-2">
      <div className="container-devit">
        <h2 className="mb-8 border-b border-site-line-dark pb-5 text-[clamp(1.6rem,3vw,2.2rem)] text-site-cream-light">
          {dict.property.relatedTitle}
        </h2>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </Room>
  )
}

export default RelatedSection
