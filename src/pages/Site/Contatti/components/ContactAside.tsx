import { useSiteDict } from '@/lib/site/dict'
import { DEVIT_WHATSAPP } from '@/lib/site/fixtures'
import { branchCity, branchStreet, telHref } from '@/lib/site/property'
import { useBranches } from '@/pages/Site/hooks/useSiteData'

const UNDERLINE = 'block underline decoration-site-accent decoration-2 underline-offset-4'

// WhatsApp Devit h24 e as sedes (vindas da API)
function ContactAside() {
  const { dict } = useSiteDict()
  const { data: branches } = useBranches()

  return (
    <aside className="space-y-8">
      <div className="rounded-2xl bg-site-ink p-7 text-site-cream">
        <h2 className="font-site-display text-[1.5rem] text-site-cream-light">{dict.contact.whatsappTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-site-cream/70">{dict.contact.whatsappLead}</p>
        <a
          href={`https://wa.me/${DEVIT_WHATSAPP.digits}`}
          target="_blank"
          rel="noopener"
          className="mt-5 block rounded-lg bg-site-accent px-5 py-3.5 text-center font-semibold text-site-ink transition-transform hover:scale-[1.02]"
        >
          {dict.contact.whatsappCta}
          <span className="mt-0.5 block font-site-mono text-[0.68rem] font-normal tracking-[0.1em]">
            {DEVIT_WHATSAPP.display}
          </span>
        </a>
      </div>

      {(branches ?? []).map((branch) => (
        <div key={branch.id} className="rounded-2xl border border-site-line bg-white p-7">
          <h2 className="font-site-display text-[1.5rem]">{branch.name}</h2>
          <address className="mt-3 not-italic leading-relaxed text-site-ink-soft">
            {branchStreet(branch)}
            <br />
            {branchCity(branch)}
          </address>
          <p className="mt-4 space-y-1">
            {branch.phone && (
              <a href={telHref(branch.phone)} className={UNDERLINE}>
                {branch.phone}
              </a>
            )}
            {branch.email && (
              <a href={`mailto:${branch.email}`} className={UNDERLINE}>
                {branch.email}
              </a>
            )}
          </p>
        </div>
      ))}
    </aside>
  )
}

export default ContactAside
