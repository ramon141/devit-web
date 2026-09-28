import { Link } from 'react-router'
import { formatNumber, formatPrice, useSiteDict, type SiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import { isRentOnly, purposeLabel, toNumber } from '@/lib/site/property'
import type { Locale, SiteCard } from '@/lib/site/types'
import PropertyImage from '@/pages/Site/components/PropertyImage'

type PropertyCardProps = {
  property: SiteCard
  priority?: boolean
}

type StatsProps = {
  property: SiteCard
  locale: Locale
  dict: SiteDict
}

// Só há a foto de capa: as três "folhas" da pasta repetem a mesma imagem
function FolderPhotos({ property, priority }: PropertyCardProps) {
  const cover = property.coverPhotoUrl ? { url: property.coverPhotoUrl } : undefined
  const seed = property.id ?? property.code ?? 'property'

  // de trás para a frente: 3, 2, capa
  return (
    <div className="folder-photos" aria-hidden>
      {[2, 1, 0].map((index) => (
        <div key={index} className={`sheet sheet-${index + 1}`}>
          <PropertyImage
            image={cover}
            seed={index === 0 ? seed : `${seed}-${index}`}
            alt=""
            priority={priority && index === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd>
        <strong className="font-semibold">{value}</strong> {unit}
      </dd>
    </div>
  )
}

function FolderStats({ property, locale, dict }: StatsProps) {
  const area = toNumber(property.areaSqm)
  const bedrooms = toNumber(property.bedrooms)
  const bathrooms = toNumber(property.bathrooms)

  return (
    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-site-line pt-3 text-sm text-site-ink-soft">
      {area !== null && (
        <Stat label={dict.property.surface} value={formatNumber(area, locale)} unit={dict.common.mq} />
      )}
      {bedrooms !== null && bedrooms > 0 && (
        <Stat
          label={dict.property.bedrooms}
          value={String(bedrooms)}
          unit={dict.property.bedrooms.toLowerCase()}
        />
      )}
      {bathrooms !== null && bathrooms > 0 && (
        <Stat
          label={dict.property.bathrooms}
          value={String(bathrooms)}
          unit={(bathrooms === 1 ? dict.property.bathroomOne : dict.property.bathrooms).toLowerCase()}
        />
      )}
    </dl>
  )
}

/**
 * O card é uma pasta: aba com a zona e o código, fotos espiando de dentro e a
 * capa com título, preço e dados. No hover a pasta entreabre; no clique a névoa
 * fecha a tela e a ficha aparece (coreografia em lib/site/casa).
 */
function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { dict, locale } = useSiteDict()
  const zoneName = property.zone?.name ?? property.address?.neighborhood ?? property.address?.city
  const showPerMonth = isRentOnly(property.purpose) && toNumber(property.price) !== null

  return (
    <article data-card className="folder group">
      <p className="folder-tab">
        <span className="truncate">{zoneName}</span>
        <span className="folder-tab-ref">
          {dict.property.reference} {property.code}
        </span>
      </p>

      <div className="folder-back">
        <FolderPhotos property={property} priority={priority} />
        <span className="folder-badge">{purposeLabel(property.purpose, dict)}</span>
      </div>

      <div className="folder-front">
        <h3 className="text-[1.3rem] leading-tight">
          <Link to={SITE_PATHS.property(property.id ?? '')} className="folder-link">
            {property.title}
          </Link>
        </h3>

        <p className="mt-2 font-site-display text-[1.55rem] leading-none text-site-ink">
          {formatPrice(property.price, locale, dict)}
          {showPerMonth && (
            <span className="font-site-sans text-sm text-site-muted">{dict.property.perMonth}</span>
          )}
        </p>

        <FolderStats property={property} locale={locale} dict={dict} />
        <span className="folder-open-hint" aria-hidden>
          {dict.property.open} ↗
        </span>
      </div>
    </article>
  )
}

export default PropertyCard
