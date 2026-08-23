import { Badge } from '@/components/ui/badge'
import { usePersonProperties } from '@/pages/Clientes/Scheda/hooks/usePersonProperties'

type SchedaImmobiliProps = {
  personId: string
}

function SchedaImmobili({ personId }: SchedaImmobiliProps) {
  const { ownerships, tenancies, purchases, proposals } = usePersonProperties(personId)
  const hasNothing =
    ownerships.length === 0 && tenancies.length === 0 && purchases.length === 0 && proposals.length === 0

  return (
    <div className="grid gap-4">
      {hasNothing && <p className="text-sm text-muted-foreground">Nessun immobile collegato.</p>}

      {ownerships.map((link) => (
        <div key={link.id} className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-border">
          <Badge variant="secondary">Proprietario</Badge>
          <span className="text-sm">{link.property?.code} · {link.property?.title}</span>
        </div>
      ))}

      {tenancies.map((link) => (
        <div key={link.id} className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-border">
          <Badge variant="secondary">Inquilino</Badge>
          <span className="text-sm">Contratto {link.rentalContract?.number}</span>
        </div>
      ))}

      {purchases.map((link) => (
        <div key={link.id} className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-border">
          <Badge variant="secondary">Acquirente</Badge>
          <span className="text-sm">Vendita {link.sale?.number}</span>
        </div>
      ))}

      {proposals.map((link) => (
        <div key={link.id} className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-border">
          <Badge variant="secondary">Proposta</Badge>
          <span className="text-sm">{link.proposal?.number}</span>
        </div>
      ))}
    </div>
  )
}

export default SchedaImmobili
