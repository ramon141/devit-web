import { useSiteDict } from '@/lib/site/dict'
import { branchCity, branchStreet, telHref } from '@/lib/site/property'
import Room from '@/pages/Site/components/Room'
import { useBranches } from '@/pages/Site/hooks/useSiteData'

const UNDERLINE = 'underline decoration-site-accent decoration-2 underline-offset-4'

// Sedes vindas da API (editáveis no CRM em Amministrazione > Filiali)
function OfficesSection() {
  const { dict } = useSiteDict()
  const { data: branches } = useBranches()

  return (
    <Room tone="cream" className="py-20">
      <div className="container-devit">
        <h2 className="mb-10 text-[clamp(1.8rem,3.4vw,2.6rem)]">{dict.about.officesTitle}</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {(branches ?? []).map((branch) => (
            <article key={branch.id} className="rounded-2xl bg-white p-8">
              <h3 className="font-site-display text-[1.7rem]">{branch.name}</h3>
              <address className="mt-4 not-italic leading-relaxed text-site-ink-soft">
                {branchStreet(branch)}
                <br />
                {branchCity(branch)}
                {branch.phone && (
                  <>
                    <br />
                    <a href={telHref(branch.phone)} className={UNDERLINE}>
                      {branch.phone}
                    </a>
                  </>
                )}
                {branch.email && (
                  <>
                    <br />
                    <a href={`mailto:${branch.email}`} className={UNDERLINE}>
                      {branch.email}
                    </a>
                  </>
                )}
              </address>
            </article>
          ))}
        </div>
      </div>
    </Room>
  )
}

export default OfficesSection
