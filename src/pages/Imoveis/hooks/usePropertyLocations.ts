import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { propertyLocationDetailControllerFind } from '@/api/generated/api'

export type PropertyCoords = {
  latitude: number
  longitude: number
}

const BATCH_SIZE = 80

function chunk(ids: string[]) {
  const batches: string[][] = []

  for (let index = 0; index < ids.length; index += BATCH_SIZE) {
    batches.push(ids.slice(index, index + BATCH_SIZE))
  }

  return batches
}

// A lista de imóveis não traz a relação locationDetail; buscamos as coordenadas em lotes
export function usePropertyLocations(propertyIds: string[]) {
  const { data, isLoading } = useQuery({
    queryKey: ['property-map-coords', propertyIds],
    enabled: propertyIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        chunk(propertyIds).map((batch) =>
          propertyLocationDetailControllerFind({ filter: { where: { propertyId: { inq: batch } } } }),
        ),
      )

      return results.flat()
    },
  })

  const coordsByPropertyId = useMemo(() => {
    const map = new Map<string, PropertyCoords>()

    for (const location of data ?? []) {
      if (location.latitude == null || location.longitude == null) continue

      const latitude = Number(location.latitude)
      const longitude = Number(location.longitude)

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
      if (latitude === 0 && longitude === 0) continue

      map.set(location.propertyId, { latitude, longitude })
    }

    return map
  }, [data])

  return { coordsByPropertyId, isLoading }
}
