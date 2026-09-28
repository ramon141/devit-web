import { toNumber } from '@/lib/site/property'
import type { SiteDetail } from '@/lib/site/types'
import PropertyMap from '@/pages/Site/PropertyDetail/components/PropertyMap'

// A ficha só mostra o mapa quando o imóvel tem coordenada pública
function MapSection({ property }: { property: SiteDetail }) {
  const lat = toNumber(property.locationDetail?.publicLatitude)
  const lng = toNumber(property.locationDetail?.publicLongitude)

  if (lat === null || lng === null) return null

  return <PropertyMap lat={lat} lng={lng} approximate label={property.title ?? ''} />
}

export default MapSection
