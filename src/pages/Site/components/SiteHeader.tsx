import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SELL_URL, SITE_PATHS } from '@/lib/site/paths'
import LanguageSwitcher from '@/pages/Site/components/LanguageSwitcher'

function SiteHeader() {
  const { dict } = useSiteDict()

  const links = [
    { href: SITE_PATHS.properties, label: dict.nav.properties },
    { href: SITE_PATHS.zones, label: dict.nav.zones },
    { href: SITE_PATHS.about, label: dict.nav.about },
    { href: SITE_PATHS.calendars, label: dict.nav.calendars },
    { href: SITE_PATHS.contact, label: dict.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-site-line bg-site-cream-light/90 backdrop-blur-md">
      <div className="container-devit flex h-[68px] items-center justify-between gap-6">
        <Link to={SITE_PATHS.home} className="flex items-baseline gap-1.5" aria-label="Devit immobiliare">
          <span className="font-site-display text-[1.5rem] italic leading-none text-site-accent-deep">
            {dict.brand.name}
          </span>
          <span className="font-site-mono text-[0.62rem] uppercase tracking-[0.2em] text-site-ink-soft">
            {dict.brand.tagline}
          </span>
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-[0.95rem] text-site-ink-soft transition-colors hover:text-site-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher label={dict.nav.language} />
          <a
            href={SELL_URL}
            className="hidden rounded-full bg-site-accent px-5 py-2.5 text-sm font-semibold text-site-ink transition-transform hover:scale-[1.03] sm:block"
          >
            {dict.nav.sell}
          </a>
        </div>
      </div>

      {/* navegação em telas pequenas: rolagem horizontal */}
      <nav
        aria-label={dict.nav.menu}
        className="flex gap-5 overflow-x-auto border-t border-site-line px-5 py-2.5 lg:hidden"
      >
        {links.map((link) => (
          <Link key={link.href} to={link.href} className="whitespace-nowrap text-sm text-site-ink-soft">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default SiteHeader
