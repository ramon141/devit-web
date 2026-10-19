import { useTranslation } from 'react-i18next'
import type { PropertyHistoryControllerHistory200ItemsItem } from '@/api/generated/models/propertyHistoryControllerHistory200ItemsItem'

type HistoryEntryProps = {
  item: PropertyHistoryControllerHistory200ItemsItem
}

const EMPTY_VALUE = '—'

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return EMPTY_VALUE
  if (typeof value === 'object') return JSON.stringify(value)

  return String(value)
}

export function HistoryEntry({ item }: HistoryEntryProps) {
  const { t } = useTranslation('imoveis')
  const author = item.user?.name ?? t('scheda.storicoTab.unknownOrigin')

  return (
    <div className="rounded-lg px-3 py-2 ring-1 ring-border">
      <p className="text-sm font-medium">
        {t(`scheda.storicoTab.categories.${item.category}`)} · {t(`scheda.storicoTab.actions.${item.action}`)}
      </p>
      <p className="text-xs text-muted-foreground">
        {item.occurredAtLocal} · {author} · {t(`scheda.storicoTab.sources.${item.source}`)}
      </p>
      {item.changes.map((change) => (
        <p key={change.field} className="text-sm">
          <span className="text-muted-foreground">{t(`scheda.storicoTab.fields.${change.field}`, change.field)}:</span>{' '}
          {formatValue(change.previous)} → {formatValue(change.new)}
        </p>
      ))}
      {item.reason && <p className="text-xs text-muted-foreground">{item.reason}</p>}
    </div>
  )
}
