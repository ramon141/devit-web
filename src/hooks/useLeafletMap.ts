import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from '@/constants/map'

type UseLeafletMapOptions = {
  center?: [number, number]
  zoom?: number
}

// Cria o mapa uma única vez no container; recentralizar é responsabilidade de quem usa
export function useLeafletMap({ center, zoom }: UseLeafletMapOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const instance = L.map(container).setView(center ?? DEFAULT_MAP_CENTER, zoom ?? DEFAULT_MAP_ZOOM)

    L.tileLayer(MAP_TILE_URL, { attribution: MAP_TILE_ATTRIBUTION, maxZoom: 19 }).addTo(instance)

    setMap(instance)

    return () => {
      instance.remove()
      setMap(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, map }
}
