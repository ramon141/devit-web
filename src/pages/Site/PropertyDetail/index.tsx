import { Link, useParams } from 'react-router'
import { formatPrice, useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import { toPhotos } from '@/lib/site/property'
import type { SiteCard, SiteDetail } from '@/lib/site/types'
import Breadcrumb from '@/pages/Site/components/Breadcrumb'
import Room from '@/pages/Site/components/Room'
import { useMotionReady } from '@/pages/Site/hooks/useMotionReady'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import { useProperty, useRelatedProperties } from '@/pages/Site/hooks/useSiteData'
import ContactCard from '@/pages/Site/PropertyDetail/components/ContactCard'
import PhotoStack from '@/pages/Site/PropertyDetail/components/PhotoStack'
import PropertySummary from '@/pages/Site/PropertyDetail/components/PropertySummary'
import RelatedSection from '@/pages/Site/PropertyDetail/components/RelatedSection'

function NotFound() {
  const { dict } = useSiteDict()

  return (
    <div className="container-devit py-24 text-center">
      <p className="font-site-display text-[1.8rem]">{dict.list.empty}</p>
      <Link
        to={SITE_PATHS.properties}
        className="mt-6 inline-block font-semibold underline decoration-site-accent decoration-2 underline-offset-4"
      >
        {dict.property.backToList}
      </Link>
    </div>
  )
}

function DossierTab({ property }: { property: SiteDetail }) {
  const { dict } = useSiteDict()

  return (
    <p className="dossier-tab">
      <span>{property.zone?.name ?? property.address?.city}</span>
      <span className="dossier-tab-ref">
        {dict.property.reference} {property.code}
      </span>
    </p>
  )
}

function Dossier({ property, related }: { property: SiteDetail; related: SiteCard[] }) {
  const { dict, locale } = useSiteDict()
  const title = property.title ?? ''

  usePageMeta(
    title,
    `${title} · ${formatPrice(property.price, locale, dict)}. ${property.zone?.name ?? property.address?.city}, Devit Immobiliare.`
  )

  const crumbs = [
    { label: dict.nav.home, to: SITE_PATHS.home },
    { label: dict.list.title, to: SITE_PATHS.properties },
    ...(property.zone?.slug
      ? [{ label: property.zone.name ?? '', to: SITE_PATHS.zone(property.zone.slug) }]
      : []),
  ]

  return (
    <div className="desk-page">
      {/* a mesa: último frame do vídeo de transição, fixo atrás de tudo */}
      <div className="desk" aria-hidden />

      <article className="dossier pb-8">
        <Room className="pt-8" inner={false}>
          <div className="room-inner container-devit">
            <Breadcrumb dark items={crumbs} />
            <PhotoStack
              images={toPhotos(property)}
              seed={property.id ?? title}
              title={title}
              labels={dict.gallery}
            />
          </div>
        </Room>

        {/* a pasta aberta com a ficha */}
        <div className="container-devit mt-12">
          <div className="dossier-folder">
            <DossierTab property={property} />
            <div className="dossier-sheet grid gap-12 lg:grid-cols-[1fr_340px]">
              <PropertySummary property={property} />
              <ContactCard property={property} />
            </div>
          </div>
        </div>

        <RelatedSection properties={related} />
      </article>
    </div>
  )
}

function PropertyDetail() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: property, isSuccess, isError } = useProperty(id)
  const related = useRelatedProperties(property)

  useMotionReady(isError || (isSuccess && related.isSuccess))

  if (isError) return <NotFound />
  if (!isSuccess) return null
  if (!property) return <NotFound />

  return <Dossier key={property.id} property={property} related={related.items} />
}

export default PropertyDetail
