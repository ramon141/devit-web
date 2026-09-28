import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { googleMapsUrl } from '@/lib/site/geo'
import { purposeLabel } from '@/lib/site/property'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'

const LINK = 'font-semibold text-site-ink underline decoration-site-accent decoration-2 underline-offset-4'

function MapPinCard({ pin, onClose }: { pin: MapPin; onClose: () => void }) {
  const { dict } = useSiteDict()
  const hasCover = !!pin.cover
  const contractLabel = purposeLabel(pin.purpose, dict)

  return (
    <div className="mappa-card" role="dialog" aria-label={pin.title}>
      {hasCover && <img src={pin.cover} alt="" className="mappa-card-img" />}

      <div className="mappa-card-body">
        <p className="font-site-mono text-[0.66rem] uppercase tracking-[0.14em] text-site-muted">
          {[pin.zoneLabel, contractLabel].filter(Boolean).join(' · ')}
        </p>
        <h3 className="mt-1 text-[1.1rem] leading-tight">{pin.title}</h3>
        <p className="mt-1 font-site-display text-[1.3rem] leading-none">{pin.price}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link to={pin.href} className={LINK}>
            {dict.map.open} →
          </Link>
          <a
            href={googleMapsUrl(pin.lat, pin.lng)}
            target="_blank"
            rel="noopener"
            className="text-site-ink-soft underline underline-offset-4"
          >
            Google Maps ↗
          </a>
        </div>
      </div>

      <button type="button" className="mappa-card-close" onClick={onClose} aria-label="×">
        ×
      </button>
    </div>
  )
}

export default MapPinCard
