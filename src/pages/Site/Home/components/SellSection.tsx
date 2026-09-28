import { useSiteDict } from '@/lib/site/dict'
import { SELL_URL } from '@/lib/site/paths'
import Room from '@/pages/Site/components/Room'

// o pendente acende quando o bloco entra na tela: o vídeo toca uma vez e para no último frame
function SellSection() {
  const { dict } = useSiteDict()

  return (
    <Room className="py-20">
      <div className="container-devit">
        <div className="sell relative overflow-hidden rounded-2xl bg-site-ink px-8 py-16 text-site-cream md:px-16 md:py-20">
          <video
            data-play-once
            className="sell-video"
            muted
            playsInline
            preload="metadata"
            poster="/video/pendente-poster.jpg"
            aria-hidden
          >
            <source src="/video/pendente-720.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/video/pendente-1080.mp4" type="video/mp4" />
          </video>
          <div className="sell-veil" aria-hidden />

          <div className="relative">
            <p className="eyebrow text-site-accent">{dict.home.sellLabel}</p>
            <h2
              data-split
              className="mt-4 max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)] text-site-cream-light"
            >
              {dict.home.sellTitle}
            </h2>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-site-cream/75">{dict.home.sellLead}</p>
            <a
              href={SELL_URL}
              className="mt-9 inline-block rounded-full bg-site-accent px-7 py-3.5 font-semibold text-site-ink transition-transform hover:scale-[1.03]"
            >
              {dict.home.sellCta}
            </a>
          </div>
        </div>
      </div>
    </Room>
  )
}

export default SellSection
