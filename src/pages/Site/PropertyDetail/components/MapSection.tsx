import { toNumber } from '@/lib/site/property'
import type { SiteDetail } from '@/lib/site/types'
import PropertyMap from '@/pages/Site/PropertyDetail/components/PropertyMap'

// A ficha só mostra o mapa quando o imóvel tem área aproximada
function MapSection({ property }: { property: SiteDetail }) {
  const lat = toNumber(property.locationDetail?.latitude)
  const lng = toNumber(property.locationDetail?.longitude)

  if (lat === null || lng === null) return null

  return <PropertyMap lat={lat} lng={lng} approximate label={property.title ?? ''} />
}

export default MapSection
