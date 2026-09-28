import { useSiteDict } from '@/lib/site/dict'
import ContactAside from '@/pages/Site/Contatti/components/ContactAside'
import ContactForm from '@/pages/Site/Contatti/components/ContactForm'
import Room from '@/pages/Site/components/Room'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'

function Contatti() {
  const { dict } = useSiteDict()

  usePageMeta(dict.contact.title, dict.contact.lead)

  return (
    <div className="py-14">
      <Room className="pb-2">
        <div className="container-devit">
          <h1 className="text-[clamp(2.2rem,5vw,3.6rem)]">{dict.contact.title}</h1>
          <p className="mt-4 max-w-[56ch] text-site-ink-soft">{dict.contact.lead}</p>
        </div>
      </Room>

      <Room className="pt-2">
        <div className="container-devit mt-8 grid gap-14 lg:grid-cols-[1fr_360px]">
          <ContactForm />
          <ContactAside />
        </div>
      </Room>
    </div>
  )
}

export default Contatti
