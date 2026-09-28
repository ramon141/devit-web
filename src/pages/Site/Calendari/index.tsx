import { useSiteDict } from '@/lib/site/dict'
import Room from '@/pages/Site/components/Room'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'

/**
 * I calendari da collezione. As imagens ficam em public/img/calendari/calendario-<anno>.jpg
 * (717×1024). Para acrescentar um ano basta colocar o arquivo e incluir o ano aqui.
 */
const CALENDARS = [2026, 2025, 2024, 2023, 2022, 2021]

function Calendari() {
  const { dict } = useSiteDict()

  usePageMeta(`${dict.calendars.title} ${dict.calendars.titleEm}`, dict.calendars.lead)

  return (
    <>
      <Room tone="dark" className="py-20">
        <div className="container-devit">
          <p className="eyebrow text-site-accent">★ {dict.calendars.eyebrow}</p>
          <h1
            data-split
            className="mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,4.6rem)] text-site-cream-light"
          >
            {dict.calendars.title} <em className="text-site-accent italic">{dict.calendars.titleEm}</em>
          </h1>
          <p className="mt-7 max-w-[60ch] leading-relaxed text-site-cream/75">{dict.calendars.lead}</p>
        </div>
      </Room>

      <Room tone="cream" className="py-16 md:py-24">
        <div className="container-devit">
          <ul className="calendari calendari-page">
            {CALENDARS.map((year, index) => (
              <li key={year} className="calendario">
                <a
                  href={`/img/calendari/calendario-${year}.jpg`}
                  target="_blank"
                  rel="noopener"
                  title={dict.calendars.open}
                  aria-label={`${dict.calendars.year} ${year} — ${dict.calendars.open}`}
                >
                  <img
                    src={`/img/calendari/calendario-${year}.jpg`}
                    alt={`${dict.calendars.year} ${year}`}
                    width={717}
                    height={1024}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className="calendario-anno">{year}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Room>
    </>
  )
}

export default Calendari
