import { useSiteDict } from '@/lib/site/dict'
import { DEVIT_WHATSAPP } from '@/lib/site/fixtures'
import { branchCity, branchStreet, telHref } from '@/lib/site/property'
import type { SiteDetail } from '@/lib/site/types'
import { useBranches } from '@/pages/Site/hooks/useSiteData'

const SECONDARY = 'block rounded-lg border px-5 py-3.5 text-center transition-colors '

// A Devit responde (não um sócio): WhatsApp h24, telefone da sede (vindo da API) e, se houver, o vídeo
function ContactCard({ property }: { property: SiteDetail }) {
  const { dict } = useSiteDict()
  const { data: branches } = useBranches()
  const branch = branches?.[0]
  const text = encodeURIComponent(`${property.title} — ${dict.property.reference} ${property.code}`)

  return (
    <aside className="lg:sticky lg:top-[92px] lg:self-start">
      <div className="rounded-2xl bg-site-ink px-7 py-8 text-site-cream">
        <h2 className="font-site-display text-[1.6rem] leading-tight text-site-cream-light">
          {dict.property.contactTitle}
        </h2>
        <p className="mt-3 text-sm text-site-cream/70">{dict.property.contactLead}</p>

        <div className="mt-7 space-y-3">
          <a
            href={`https://wa.me/${DEVIT_WHATSAPP.digits}?text=${text}`}
            target="_blank"
            rel="noopener"
            className="block rounded-lg bg-site-accent px-5 py-3.5 text-center font-semibold text-site-ink transition-transform hover:scale-[1.02]"
          >
            {dict.property.whatsappH24}
            <span className="mt-0.5 block font-site-mono text-[0.68rem] font-normal tracking-[0.1em]">
              {DEVIT_WHATSAPP.display}
            </span>
          </a>

          {branch?.phone && (
            <a
              href={telHref(branch.phone)}
              className={`${SECONDARY} border-site-line-dark text-site-cream hover:border-site-accent hover:text-site-accent`}
            >
              {dict.property.call} · {branch.phone}
            </a>
          )}
        </div>

        {branch && (
          <p className="mt-7 border-t border-site-line-dark pt-6 text-sm leading-relaxed text-site-cream/60">
            {branch.name}
            <br />
            {branchStreet(branch)}
            <br />
            {branchCity(branch)}
          </p>
        )}
      </div>
    </aside>
  )
}

export default ContactCard
