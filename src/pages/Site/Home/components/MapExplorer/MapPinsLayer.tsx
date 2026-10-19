import { useEffect } from 'react'
import L from 'leaflet'
import { useLeafletMap } from '@/hooks/useLeafletMap'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'

const AREA_FILL_OPACITY = 0.35
const AREA_FILL_OPACITY_ACTIVE = 0.6
const AREA_BORDER_WEIGHT = 2
const MIN_AREA_RADIUS_PX = 8
const METERS_PER_PIXEL_AT_ZOOM_0 = 156543.03
const FIT_PADDING: [number, number] = [40, 40]
const FIT_MAX_ZOOM = 15
const COLOR_SALE = '#ffcc00'
const COLOR_RENT = '#ffffff'
const COLOR_BORDER = '#0b0b0b'

type MapPinsLayerProps = {
  pins: MapPin[]
  activeId: string | null
  onSelect: (id: string | null) => void
}

// Pontos sobre um mapa navegável (arrastar, zoom por roda/botões/toque)
function MapPinsLayer({ pins, activeId, onSelect }: MapPinsLayerProps) {
  const { containerRef, map } = useLeafletMap()

  // Enquadra os pontos visíveis quando o filtro muda
  useEffect(() => {
    if (!map || !pins.length) return

    const bounds = L.latLngBounds(pins.map((pin) => [pin.lat, pin.lng]))
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM })
  }, [map, pins])

  useEffect(() => {
    if (!map) return

    const layer = L.layerGroup().addTo(map)
    const areas: { circle: L.Circle; meters: number }[] = []

    // Ao afastar, a área real viraria menos que um ponto: garante um tamanho mínimo na tela
    const applyMinimumSize = () => {
      const metersPerPixel =
        (METERS_PER_PIXEL_AT_ZOOM_0 * Math.cos((map.getCenter().lat * Math.PI) / 180)) /
        2 ** map.getZoom()

      areas.forEach(({ circle, meters }) => {
        circle.setRadius(Math.max(meters, MIN_AREA_RADIUS_PX * metersPerPixel))
      })
    }

    pins.forEach((pin) => {
      const active = pin.id === activeId

      // Círculo em metros: acompanha o zoom e continua cobrindo o quarteirão
      const circle = L.circle([pin.lat, pin.lng], {
        radius: pin.radiusMeters,
        weight: active ? AREA_BORDER_WEIGHT + 1 : AREA_BORDER_WEIGHT,
        color: COLOR_BORDER,
        fillColor: pin.purpose === 'rent' ? COLOR_RENT : COLOR_SALE,
        fillOpacity: active ? AREA_FILL_OPACITY_ACTIVE : AREA_FILL_OPACITY,
      })
      circle.on('click', () => onSelect(active ? null : pin.id))
      circle.addTo(layer)

      areas.push({ circle, meters: pin.radiusMeters })
    })

    applyMinimumSize()
    map.on('zoomend', applyMinimumSize)

    return () => {
      map.off('zoomend', applyMinimumSize)
      layer.remove()
    }
  }, [map, pins, activeId, onSelect])

  return <div ref={containerRef} className="mappa-leaflet" />
}

export default MapPinsLayer
