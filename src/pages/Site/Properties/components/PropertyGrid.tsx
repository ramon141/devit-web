import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import type { SiteCard } from '@/lib/site/types'
import PropertyCard from '@/pages/Site/components/PropertyCard'

function EmptyResults() {
  const { dict } = useSiteDict()

  return (
    <div className="rounded-xl border border-dashed border-site-line px-8 py-20 text-center">
      <p className="font-site-display text-[1.6rem]">{dict.list.empty}</p>
      <p className="mt-3 text-site-ink-soft">{dict.list.emptyHint}</p>
      <Link
        to={SITE_PATHS.properties}
        className="mt-7 inline-block rounded-lg bg-site-ink px-6 py-3 font-semibold text-site-cream transition-colors hover:bg-site-accent hover:text-site-ink"
      >
        {dict.search.reset}
      </Link>
    </div>
  )
}

// Grade de pastas (ou o aviso de nenhum resultado), reaproveitada por catálogo e zonas
function PropertyGrid({ items, columns = 'xl' }: { items: SiteCard[]; columns?: 'xl' | 'lg' }) {
  if (items.length === 0) return <EmptyResults />

  const layout = columns === 'xl' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid gap-7 ${layout}`}>
      {items.map((property, index) => (
        <PropertyCard key={property.id} property={property} priority={index < 3} />
      ))}
    </div>
  )
}

export default PropertyGrid
