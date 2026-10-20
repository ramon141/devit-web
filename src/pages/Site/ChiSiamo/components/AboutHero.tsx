import { useSiteDict } from '@/lib/site/dict'
import SiteVideo from '@/pages/Site/components/SiteVideo'
import Room from '@/pages/Site/components/Room'

// o palazzo acende as janelas uma a uma quando a página abre (toca uma vez)
function AboutHero() {
  const { dict } = useSiteDict()

  return (
    <Room tone="dark" className="about-hero py-20" inner={false}>
      <div className="about-bg" aria-hidden>
        <SiteVideo
          name="finestre"
          data-play-once
          className="about-video"
          muted
          playsInline
          preload="metadata"
          poster="/video/finestre-poster.jpg"
        />
        <div className="about-veil" />
      </div>

      <div className="room-inner container-devit">
        <p className="eyebrow text-site-accent">{dict.nav.about}</p>
        <h1
          data-split
          className="mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,4.6rem)] text-site-cream-light"
        >
          {dict.about.title} <em className="text-site-accent italic">{dict.about.titleEm}</em>
        </h1>
        <p className="mt-7 max-w-[60ch] leading-relaxed text-site-cream/75">{dict.about.lead}</p>
      </div>
    </Room>
  )
}

export default AboutHero
