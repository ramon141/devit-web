import { useTranslation } from 'react-i18next'
import { usePropertyPriceHistoryControllerFind, usePropertyStatusHistoryControllerFind } from '@/api/generated/api'
import { formatAmount } from '@/utils/formatAmount'
import { formatDateTime } from '@/utils/formatDate'

type PropertyStoricoTabProps = {
  propertyId: string
}

function PropertyStoricoTab({ propertyId }: PropertyStoricoTabProps) {
  const { t } = useTranslation('imoveis')
  const { data: priceHistory } = usePropertyPriceHistoryControllerFind({
    filter: { where: { propertyId }, order: ['changedAt DESC'] },
  })
  const { data: statusHistory } = usePropertyStatusHistoryControllerFind({
    filter: { where: { propertyId }, order: ['occurredAt DESC'] },
  })

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-medium">{t('scheda.storicoTab.priceHistoryTitle')}</p>
        <div className="grid gap-2">
          {(priceHistory ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">{t('scheda.storicoTab.emptyHistory')}</p>
          )}
          {(priceHistory ?? []).map((entry) => (
            <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
              <p className="text-sm">
                {entry.previousPrice != null ? formatAmount(entry.previousPrice) : '—'} → {formatAmount(entry.newPrice)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateTime(entry.changedAt)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">{t('scheda.storicoTab.statusHistoryTitle')}</p>
        <div className="grid gap-2">
          {(statusHistory ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">{t('scheda.storicoTab.emptyHistory')}</p>
          )}
          {(statusHistory ?? []).map((entry) => (
            <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
              <p className="text-sm">
                {entry.previousStatus ?? '—'} → {entry.newStatus}
              </p>
              {entry.reason && <p className="text-xs text-muted-foreground">{entry.reason}</p>}
              <p className="text-xs text-muted-foreground">{formatDateTime(entry.occurredAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyStoricoTab
