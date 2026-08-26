import { useTranslation } from 'react-i18next'
import { useSaleStatusHistoryControllerFind } from '@/api/generated/api'
import { formatDateTime } from '@/utils/formatDate'

type SaleStatusHistoryTabProps = {
  saleId: string
}

function SaleStatusHistoryTab({ saleId }: SaleStatusHistoryTabProps) {
  const { t } = useTranslation('operazioni')
  const { data: history } = useSaleStatusHistoryControllerFind({
    filter: { where: { saleId }, order: ['occurredAt DESC'] },
  })

  return (
    <div className="grid gap-2">
      {(history ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">{t('vendite.statusHistoryTab.emptyMessage')}</p>
      )}
      {(history ?? []).map((entry) => (
        <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <p className="text-sm">
            {entry.previousStatus ?? '—'} → {entry.newStatus}
          </p>
          {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
          <p className="text-xs text-muted-foreground">{formatDateTime(entry.occurredAt)}</p>
        </div>
      ))}
    </div>
  )
}

export default SaleStatusHistoryTab
