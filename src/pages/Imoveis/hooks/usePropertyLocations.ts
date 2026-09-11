import { useMemo } from 'react'
import { usePropertyLocationDetailControllerFind } from '@/api/generated/api'

export type PropertyCoords = {
  latitude: number
  longitude: number
}

// A lista de imóveis não traz a relação locationDetail; buscamos as coordenadas em lote
export function usePropertyLocations(propertyIds: string[]) {
  const { data, isLoading } = usePropertyLocationDetailControllerFind(
    { filter: { where: { propertyId: { inq: propertyIds } } } },
    { query: { enabled: propertyIds.length > 0 } },
  )

  const coordsByPropertyId = useMemo(() => {
    const map = new Map<string, PropertyCoords>()

    for (const location of data ?? []) {
      if (location.latitude == null || location.longitude == null) continue

      map.set(location.propertyId, {
        latitude: location.latitude,
        longitude: location.longitude,
      })
    }

    return map
  }, [data])

  return { coordsByPropertyId, isLoading }
}
