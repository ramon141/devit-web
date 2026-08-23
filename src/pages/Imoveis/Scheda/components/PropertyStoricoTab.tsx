import dayjs from 'dayjs'
import { usePropertyPriceHistoryControllerFind, usePropertyStatusHistoryControllerFind } from '@/api/generated/api'

type PropertyStoricoTabProps = {
  propertyId: string
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function PropertyStoricoTab({ propertyId }: PropertyStoricoTabProps) {
  const { data: priceHistory } = usePropertyPriceHistoryControllerFind({
    filter: { where: { propertyId }, order: ['changedAt DESC'] },
  })
  const { data: statusHistory } = usePropertyStatusHistoryControllerFind({
    filter: { where: { propertyId }, order: ['occurredAt DESC'] },
  })

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-medium">Storico prezzo</p>
        <div className="grid gap-2">
          {(priceHistory ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nessuna modifica registrata.</p>
          )}
          {(priceHistory ?? []).map((entry) => (
            <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
              <p className="text-sm">
                {entry.previousPrice != null ? formatAmount(entry.previousPrice) : '—'} → {formatAmount(entry.newPrice)}
              </p>
              <p className="text-xs text-muted-foreground">{dayjs(entry.changedAt).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Storico stato</p>
        <div className="grid gap-2">
          {(statusHistory ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nessuna modifica registrata.</p>
          )}
          {(statusHistory ?? []).map((entry) => (
            <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
              <p className="text-sm">
                {entry.previousStatus ?? '—'} → {entry.newStatus}
              </p>
              {entry.reason && <p className="text-xs text-muted-foreground">{entry.reason}</p>}
              <p className="text-xs text-muted-foreground">{dayjs(entry.occurredAt).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyStoricoTab
