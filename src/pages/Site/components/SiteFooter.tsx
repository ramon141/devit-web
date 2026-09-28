import dayjs from 'dayjs'
import { Link } from 'react-router'
import { useSiteDict, type SiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import { branchCity, branchStreet, telHref } from '@/lib/site/property'
import type { SiteZone } from '@/lib/site/types'
import { useBranches, useZones } from '@/pages/Site/hooks/useSiteData'

const HEADING = 'mb-4 font-site-mono text-[0.7rem] uppercase tracking-[0.16em] text-site-accent'
const LINK = 'text-site-cream/75 transition-colors hover:text-site-accent'

function ZoneColumn({ zones, title }: { zones: SiteZone[]; title: string }) {
  return (
    <nav aria-label={title}>
      <h2 className={HEADING}>{title}</h2>
      <ul className="space-y-2 text-sm">
        {zones.map((zone) => (
          <li key={zone.slug}>
            <Link to={SITE_PATHS.zone(zone.slug ?? '')} className={LINK}>
              {zone.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function OfficeColumn({ dict }: { dict: SiteDict }) {
  const { data: branches } = useBranches()

  return (
    <div>
      <h2 className={HEADING}>{dict.about.officesTitle}</h2>
      <ul className="space-y-5 text-sm text-site-cream/75">
        {(branches ?? []).map((branch) => (
          <li key={branch.id}>
            <p className="font-semibold text-site-cream">{branch.name}</p>
            <p>{branchStreet(branch)}</p>
            <p>{branchCity(branch)}</p>
            {branch.phone && (
              <a
                href={telHref(branch.phone)}
                className="mt-1 inline-block transition-colors hover:text-site-accent"
              >
                {branch.phone}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SiteFooter() {
  const { dict } = useSiteDict()
  const { data: zones } = useZones()

  const moreLinks = [
    { href: SITE_PATHS.requests, label: dict.footer.requests },
    { href: SITE_PATHS.news, label: dict.footer.news },
    { href: SITE_PATHS.ownerArea, label: dict.footer.ownerArea },
    { href: SITE_PATHS.privacy, label: dict.footer.privacy },
    { href: SITE_PATHS.privacy, label: dict.footer.cookies },
  ]

  return (
    <footer className="mt-24 bg-site-ink text-site-cream">
      <div className="container-devit grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-baseline gap-1.5">
            <span className="font-site-display text-[1.6rem] italic leading-none text-site-accent">
              {dict.brand.name}
            </span>
            <span className="font-site-mono text-[0.62rem] uppercase tracking-[0.2em] text-site-cream/60">
              {dict.brand.tagline}
            </span>
          </p>
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-site-cream/70">
            {dict.home.heroLead}
          </p>
          <p className="mt-6 font-site-mono text-[0.7rem] uppercase tracking-[0.14em] text-site-cream/45">
            {dict.footer.legal}
          </p>
        </div>

        <ZoneColumn zones={zones ?? []} title={dict.footer.zones} />
        <OfficeColumn dict={dict} />
      </div>

      <div className="border-t border-site-line-dark">
        <div className="container-devit flex flex-wrap items-center justify-between gap-4 py-6 text-[0.8rem] text-site-cream/55">
          <p>
            © {dayjs().year()} Devit Servizi Immobiliari. {dict.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {moreLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="transition-colors hover:text-site-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>{dict.brand.since}</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
