import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useLeafletMap } from '@/hooks/useLeafletMap'
import { pinIcon } from '@/lib/mapIcons'

type Coords = {
  latitude: number
  longitude: number
}

type MapPickerProps = {
  latitude: number | null
  longitude: number | null
  onChange: (coords: Coords) => void
  className?: string
}

function MapPicker({ latitude, longitude, onChange, className }: MapPickerProps) {
  const hasCoords = latitude != null && longitude != null
  const { containerRef, map } = useLeafletMap({
    center: hasCoords ? [latitude, longitude] : undefined,
    zoom: hasCoords ? 16 : undefined,
  })
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!map) return

    function handleClick(event: L.LeafletMouseEvent) {
      onChangeRef.current({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    }

    map.on('click', handleClick)
    // ponytail: o container só ganha altura depois do layout da aba; um invalidateSize resolve
    const timer = window.setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.off('click', handleClick)
      window.clearTimeout(timer)
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    if (latitude == null || longitude == null) {
      markerRef.current?.remove()
      markerRef.current = null
      return
    }

    const position: L.LatLngTuple = [latitude, longitude]

    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    } else {
      markerRef.current = L.marker(position, { icon: pinIcon, draggable: true })
        .on('dragend', (event) => {
          const { lat, lng } = (event.target as L.Marker).getLatLng()
          onChangeRef.current({ latitude: lat, longitude: lng })
        })
        .addTo(map)
    }

    map.panTo(position)
  }, [map, latitude, longitude])

  return <div ref={containerRef} className={className ?? 'h-96 w-full rounded-md ring-1 ring-border'} />
}

export default MapPicker
