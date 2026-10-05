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
      // coordenada (0,0) é dado ausente gravado como 0 em vez
      // de null (6.323 de 8.811 imóveis), não um ponto real no Golfo da
      // Guiné; sem esse filtro o mapa pulava pro meio do oceano
      if (location.latitude === 0 && location.longitude === 0) continue

      map.set(location.propertyId, {
        latitude: location.latitude,
        longitude: location.longitude,
      })
    }

    return map
  }, [data])

  return { coordsByPropertyId, isLoading }
}
