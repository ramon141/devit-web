import { formatPrice, useSiteDict } from '@/lib/site/dict'
import { isRentOnly, toNumber } from '@/lib/site/property'
import type { SiteDetail } from '@/lib/site/types'
import FeatureTags from '@/pages/Site/PropertyDetail/components/FeatureTags'
import MapSection from '@/pages/Site/PropertyDetail/components/MapSection'
import SectionTitle from '@/pages/Site/PropertyDetail/components/SectionTitle'
import { buildSpecs } from '@/pages/Site/PropertyDetail/utils/buildSpecs'

// Título, preço, dados, descrição, características e mapa (a coluna principal da ficha)
function PropertySummary({ property }: { property: SiteDetail }) {
  const { dict, locale } = useSiteDict()
  const place = property.zone?.name ?? property.address?.neighborhood ?? property.address?.city
  const showPerMonth = isRentOnly(property.purpose) && toNumber(property.price) !== null
  const features = property.features ?? []

  return (
    <div>
      <p className="font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-muted">
        {place} · {dict.property.reference} {property.code}
      </p>

      <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)]">{property.title}</h1>

      <p className="mt-5 font-site-display text-[clamp(2rem,4vw,2.8rem)] leading-none text-site-ink">
        {formatPrice(property.price, locale, dict)}
        {showPerMonth && (
          <span className="font-site-sans text-base text-site-muted">{dict.property.perMonth}</span>
        )}
      </p>

      <section className="mt-10" aria-labelledby="specs">
        <SectionTitle id="specs">{dict.property.details}</SectionTitle>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {buildSpecs(property, locale, dict).map((spec) => (
            <div key={spec.label}>
              <dt className="text-[0.78rem] text-site-muted">{spec.label}</dt>
              <dd className="mt-1 font-site-display text-[1.4rem] leading-none">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {property.description && (
        <section className="mt-12" aria-labelledby="desc">
          <SectionTitle id="desc">{dict.property.description}</SectionTitle>
          <div className="max-w-[68ch] space-y-4 leading-relaxed text-site-ink-soft">
            {property.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="mt-12" aria-labelledby="feat">
          <SectionTitle id="feat">{dict.property.features}</SectionTitle>
          <FeatureTags features={features} />
        </section>
      )}

      <MapSection property={property} />
    </div>
  )
}

export default PropertySummary
