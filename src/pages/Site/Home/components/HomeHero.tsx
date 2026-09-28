import dayjs from 'dayjs'
import { formatNumber, useSiteDict } from '@/lib/site/dict'
import SearchFilters from '@/pages/Site/components/SearchFilters'
import { EMPTY_FILTERS } from '@/pages/Site/components/SearchFilters/filterValues'

const FOUNDED_YEAR = 1995

function HeroStats({ total, offices }: { total: number; offices: number }) {
  const { dict, locale } = useSiteDict()

  const stats = [
    { value: formatNumber(total, locale), label: dict.home.statsProperties },
    { value: String(dayjs().year() - FOUNDED_YEAR), label: dict.home.statsYears },
    { value: String(offices), label: dict.home.statsOffices },
  ]

  return (
    <dl className="mt-14 grid gap-8 border-t border-site-line-dark pt-8 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block font-site-display text-[2.6rem] leading-none text-site-accent">
              {stat.value}
            </span>
            <span className="mt-2 block text-sm text-site-cream/60">{stat.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Abertura em loop: quatro planos de Napoli com crossfade. Celular recebe a
 * versão 720p; desktop, 1080p. Com prefers-reduced-motion o vídeo some e fica
 * uma imagem da cidade.
 */
function HomeHero({ total, offices }: { total: number; offices: number }) {
  const { dict } = useSiteDict()

  return (
    <section data-hero className="hero relative overflow-hidden bg-site-ink text-site-cream">
      <div className="hero-media" aria-hidden>
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          width={1920}
          height={1080}
        >
          <source src="/video/hero-loop-720.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/video/hero-loop-1080.mp4" type="video/mp4" />
        </video>
        <div className="hero-veil" />
      </div>

      <div className="container-devit relative py-20 md:py-28">
        <p className="eyebrow rise text-site-accent">{dict.home.heroEyebrow}</p>
        <h1
          data-split
          className="mt-6 max-w-[16ch] text-[clamp(2.8rem,7vw,5.6rem)] text-site-cream-light"
        >
          {dict.home.heroTitle} <em className="text-site-accent italic">{dict.home.heroTitleEm}</em>
        </h1>
        <p className="rise mt-7 max-w-[54ch] text-[1.05rem] leading-relaxed text-site-cream/75">
          {dict.home.heroLead}
        </p>

        <div className="mt-12">
          <h2 className="sr-only">{dict.home.searchTitle}</h2>
          <SearchFilters variant="hero" current={EMPTY_FILTERS} />
        </div>

        <HeroStats total={total} offices={offices} />
      </div>
    </section>
  )
}

export default HomeHero
