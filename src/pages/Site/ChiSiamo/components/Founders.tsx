import { pickLocalized, useSiteDict } from '@/lib/site/dict'
import { AGENTS } from '@/lib/site/fixtures'
import type { Agent } from '@/lib/site/types'
import Room from '@/pages/Site/components/Room'

// "DE" e "VIT": a origem do nome Devit
function FounderName({ index }: { index: number }) {
  if (index === 0) {
    return (
      <>
        Angelo <span className="founder-hl">De</span> Santis
      </>
    )
  }

  return (
    <>
      Massimiliano <span className="founder-hl">Vit</span>ale
    </>
  )
}

function FounderCard({ agent, index }: { agent: Agent; index: number }) {
  const { locale } = useSiteDict()

  return (
    <article className="founder rounded-2xl border border-site-line bg-white p-8">
      <p className="founder-mark" aria-hidden>
        {index === 0 ? 'DE' : 'VIT'}
      </p>
      <h3 className="font-site-display text-[1.9rem] leading-tight">
        <FounderName index={index} />
      </h3>
      <p className="mt-2 font-site-mono text-[0.7rem] uppercase tracking-[0.14em] text-site-accent-deep">
        {pickLocalized(agent.role, locale)}
      </p>
    </article>
  )
}

function Founders() {
  const { dict } = useSiteDict()

  return (
    <Room className="py-20">
      <div className="container-devit">
        <h2 className="mb-4 border-b border-site-line pb-5 text-[clamp(1.8rem,3.4vw,2.6rem)]">
          {dict.about.valuesTitle}
        </h2>
        <p className="mb-10 max-w-[62ch] text-site-ink-soft">{dict.about.foundersLead}</p>

        <div className="grid gap-10 md:grid-cols-2">
          {AGENTS.map((agent, index) => (
            <FounderCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </Room>
  )
}

export default Founders
