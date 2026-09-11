import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import type { PropertyWithRelations } from '@/api/generated/models'
import { useLeafletMap } from '@/hooks/useLeafletMap'
import { createPriceIcon } from '@/lib/mapIcons'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { usePropertyLocations, type PropertyCoords } from '@/pages/Imoveis/hooks/usePropertyLocations'
import { formatAmount } from '@/utils/formatAmount'

type PropertyMapViewProps = {
  properties: PropertyWithRelations[]
  isLoading: boolean
}

type MarkerBuilderOptions = {
  properties: PropertyWithRelations[]
  coordsByPropertyId: Map<string, PropertyCoords>
  group: L.LayerGroup
  referenceLabel: (code: string) => string
  onSelect: (propertyId: string) => void
}

function addPriceMarkers({ properties, coordsByPropertyId, group, referenceLabel, onSelect }: MarkerBuilderOptions) {
  const points: L.LatLngTuple[] = []

  for (const property of properties) {
    const coords = property.id ? coordsByPropertyId.get(property.id) : undefined
    if (!coords || !property.id) continue

    const position: L.LatLngTuple = [coords.latitude, coords.longitude]
    const propertyId = property.id
    points.push(position)

    L.marker(position, {
      icon: createPriceIcon({
        price: formatAmount(property.salePrice ?? property.rentPrice),
        code: referenceLabel(property.code),
        selected: !!property.propertyDetail?.prestige,
      }),
    })
      .on('click', () => onSelect(propertyId))
      .addTo(group)
  }

  return points
}

function PropertyMapView({ properties, isLoading }: PropertyMapViewProps) {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()
  const propertyIds = properties.flatMap((property) => (property.id ? [property.id] : []))
  const { coordsByPropertyId, isLoading: isLoadingCoords } = usePropertyLocations(propertyIds)
  const { containerRef, map } = useLeafletMap()
  const groupRef = useRef<L.LayerGroup | null>(null)
  const hasCoords = properties.some((property) => property.id && coordsByPropertyId.has(property.id))

  useEffect(() => {
    if (!map) return

    const group = L.layerGroup().addTo(map)
    groupRef.current = group

    const points = addPriceMarkers({
      properties,
      coordsByPropertyId,
      group,
      referenceLabel: (code) => t('card.reference', { code }),
      onSelect: (propertyId) => navigate(`${CRM_BASE_PATH}/proprieta/${propertyId}`),
    })

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 16 })
    }

    map.invalidateSize()

    return () => {
      group.remove()
      groupRef.current = null
    }
  }, [map, properties, coordsByPropertyId, navigate, t])

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[600px] w-full rounded-lg ring-1 ring-border" />

      {!isLoading && !isLoadingCoords && !hasCoords && (
        <p className="absolute inset-x-0 top-3 z-[400] mx-auto w-fit rounded-md bg-card px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-border">
          {t('list.emptyMap')}
        </p>
      )}
    </div>
  )
}

export default PropertyMapView
