import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePropertyHistoryControllerHistory, useUserControllerFind } from '@/api/generated/api'
import type { PropertyHistoryControllerHistoryCategory } from '@/api/generated/models/propertyHistoryControllerHistoryCategory'
import SearchableSelect from '@/components/SearchableSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HistoryEntry } from './PropertyHistoryEntry'

type PropertyStoricoTabProps = {
  propertyId: string
}

const CATEGORIES: PropertyHistoryControllerHistoryCategory[] = [
  'data',
  'price',
  'status',
  'activation',
  'owner',
  'responsible',
  'photos',
  'documents',
  'features',
  'rooms',
  'fees',
  'details',
]

// datetime-local entrega "2026-03-10T10:15"; o servidor recebe ISO com fuso.
function toIso(value: string) {
  return value ? new Date(value).toISOString() : undefined
}

function PropertyStoricoTab({ propertyId }: PropertyStoricoTabProps) {
  const { t } = useTranslation('imoveis')
  const [userId, setUserId] = useState('')
  const [category, setCategory] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data: users } = useUserControllerFind()
  const { data: history } = usePropertyHistoryControllerHistory(propertyId, {
    userId: userId || undefined,
    category: (category || undefined) as PropertyHistoryControllerHistoryCategory | undefined,
    from: toIso(from),
    to: toIso(to),
  })

  const items = history?.items ?? []
  const brokerOptions = (users ?? []).flatMap((user) =>
    user.id ? [{ value: user.id, label: user.fullName }] : [],
  )
  const categoryOptions = CATEGORIES.map((item) => ({
    value: item,
    label: t(`scheda.storicoTab.categories.${item}`),
  }))

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <SearchableSelect
          label={t('scheda.storicoTab.filterBroker')}
          value={userId}
          onValueChange={setUserId}
          placeholder={t('scheda.storicoTab.filterAll')}
          options={brokerOptions}
        />
        <SearchableSelect
          label={t('scheda.storicoTab.filterType')}
          value={category}
          onValueChange={setCategory}
          placeholder={t('scheda.storicoTab.filterAll')}
          options={categoryOptions}
        />
        <div className="grid gap-1">
          <Label>{t('scheda.storicoTab.filterFrom')}</Label>
          <Input type="datetime-local" step={1} value={from} onChange={(event) => setFrom(event.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label>{t('scheda.storicoTab.filterTo')}</Label>
          <Input type="datetime-local" step={1} value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
      </div>

      <div className="grid gap-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">{t('scheda.storicoTab.emptyHistory')}</p>}
        {items.map((item) => (
          <HistoryEntry key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default PropertyStoricoTab
