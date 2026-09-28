import { useSiteDict } from '@/lib/site/dict'
import { MAP, googleEmbedUrl, googleMapsUrl, project } from '@/lib/site/geo'

type PropertyMapProps = {
  lat: number
  lng: number
  approximate: boolean
  label: string
}

// a imagem é ampliada 2,6× dentro do quadro (16:9) e centrada no pino
const ZOOM = 2.6

/**
 * "Dove si trova": o recorte do mapa do golfo em volta do imóvel (imagem
 * estática, sem scripts nem chave), com o pino Devit; ao lado, o Google Maps
 * incorporado. Com `approximate` o pino vira um círculo de zona e o aviso explica.
 */
function PropertyMap({ lat, lng, approximate, label }: PropertyMapProps) {
  const { dict } = useSiteDict()
  const { x, y } = project(lat, lng)
  const imageWidth = ZOOM * 100
  const imageHeight = (imageWidth * MAP.height) / MAP.width / (9 / 16)
  const left = 50 - (x / 100) * imageWidth
  const top = 50 - (y / 100) * imageHeight

  return (
    <section className="mt-12" aria-labelledby="dove">
      <h2
        id="dove"
        className="mb-5 font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-ink"
      >
        {dict.map.where}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <figure className="mappa-quadro" aria-label={label}>
          <img
            src={MAP.src}
            alt=""
            width={MAP.width}
            height={MAP.height}
            loading="lazy"
            decoding="async"
            className="mappa-img"
            style={{ width: `${imageWidth}%`, left: `${left}%`, top: `${top}%` }}
          />
          <span className={approximate ? 'mappa-zona' : 'mappa-pino'} aria-hidden />
          <figcaption className="mappa-attr">{dict.map.attribution}</figcaption>
        </figure>

        <div className="mappa-google">
          <iframe
            title={`Google Maps — ${label}`}
            src={googleEmbedUrl(lat, lng, approximate ? 15 : 16)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="mappa-iframe"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-site-ink-soft">
        <a
          href={googleMapsUrl(lat, lng)}
          target="_blank"
          rel="noopener"
          className="font-semibold text-site-ink underline decoration-site-accent decoration-2 underline-offset-4"
        >
          {dict.map.openGoogle} ↗
        </a>
        {approximate && <p className="m-0">{dict.map.approx}</p>}
      </div>
    </section>
  )
}

export default PropertyMap
