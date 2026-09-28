import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
import { usePropertyControllerFind } from '@/api/generated/api'
import type { DraftProperty } from '@/pages/Agenda/hooks/useCalendarEventDraft'

type CalendarEventPropertiesDraftManagerProps = {
  properties: DraftProperty[]
  onAdd: (property: DraftProperty) => void
  onRemove: (propertyId: string) => void
}

function CalendarEventPropertiesDraftManager({
  properties,
  onAdd,
  onRemove,
}: CalendarEventPropertiesDraftManagerProps) {
  const { t } = useTranslation('agenda')
  const [propertyId, setPropertyId] = useState('')
  const { data: options } = usePropertyControllerFind({ filter: { order: ['title ASC'], limit: 200 } })
  const propertyOptions = (options ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))

  function handleAdd() {
    const property = options?.find((item) => item.id === propertyId)
    if (!property?.id) return

    onAdd({ propertyId: property.id, code: property.code, title: property.title })
    setPropertyId('')
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:propertiesManager.title')}</p>

      {properties.map((property) => (
        <RemovableRow key={property.propertyId} onRemove={() => onRemove(property.propertyId)}>
          <span className="text-sm">
            {property.code} · {property.title}
          </span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={propertyId}
            onValueChange={setPropertyId}
            options={propertyOptions}
            placeholder={t('agenda:propertiesManager.placeholder')}
            searchPlaceholder={t('agenda:propertiesManager.searchPlaceholder')}
          />
        </div>
        <Button type="button" onClick={handleAdd}>
          {t('agenda:propertiesManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventPropertiesDraftManager
