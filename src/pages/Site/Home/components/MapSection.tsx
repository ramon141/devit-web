import { useSiteDict } from '@/lib/site/dict'
import MapExplorer from '@/pages/Site/Home/components/MapExplorer'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'
import Room from '@/pages/Site/components/Room'

function MapSection({ pins }: { pins: MapPin[] }) {
  const { dict } = useSiteDict()

  return (
    <Room className="py-20">
      <div className="container-devit">
        <p className="eyebrow">{dict.map.label}</p>
        <h2 data-split className="mt-3 text-[clamp(2rem,4vw,3rem)]">
          {dict.map.title}
        </h2>
        <p className="mt-4 max-w-[58ch] text-site-ink-soft">{dict.map.lead}</p>

        <div className="mt-8">
          <MapExplorer pins={pins} />
        </div>
      </div>
    </Room>
  )
}

export default MapSection
