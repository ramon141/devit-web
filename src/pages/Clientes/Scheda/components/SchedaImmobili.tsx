import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { usePersonProperties } from '@/pages/Clientes/Scheda/hooks/usePersonProperties'
import type { PersonLink } from '@/pages/Clientes/Scheda/utils/personLinks'

type SchedaImmobiliProps = {
  personId: string
}

function SchedaImmobili({ personId }: SchedaImmobiliProps) {
  const { t } = useTranslation('clientes')
  const links = usePersonProperties(personId)

  function linkText(link: PersonLink) {
    if (link.role === 'tenant' || link.role === 'landlord') {
      return t('schedaImmobili.contractPrefix', { number: link.text })
    }

    if (link.role === 'seller' || link.role === 'buyer') {
      return t('schedaImmobili.salePrefix', { number: link.text })
    }

    return link.text
  }

  return (
    <div id="cliente-scheda-immobili" className="grid gap-4">
      {links.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('schedaImmobili.empty')}</p>
      )}

      {links.map((link) => (
        <div
          key={`${link.role}:${link.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-border"
        >
          <Badge variant="secondary">{t(`schedaImmobili.${link.role}`)}</Badge>
          <span className="text-sm">{linkText(link)}</span>
        </div>
      ))}
    </div>
  )
}

export default SchedaImmobili
