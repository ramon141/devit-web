import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PropertySelect } from '@/components/RemoteSelects'
import RemovableRow from '@/components/RemovableRow'
import { formatPropertyBroker } from '@/utils/formatBroker'
import { useCalendarEventProperties } from '@/pages/Agenda/hooks/useCalendarEventProperties'

type CalendarEventPropertiesManagerProps = {
  calendarEventId: string
}

function CalendarEventPropertiesManager({ calendarEventId }: CalendarEventPropertiesManagerProps) {
  const { t } = useTranslation('agenda')
  const { links, propertyId, setPropertyId, addProperty, removeProperty } =
    useCalendarEventProperties(calendarEventId)

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:propertiesManager.title')}</p>

      {links.map((link) => (
        <RemovableRow key={link.id} onRemove={() => link.id && removeProperty(link.id)}>
          <span className="text-sm">
            {link.property?.code} · {link.property?.title} · {formatPropertyBroker(link.property)}
          </span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <PropertySelect
            value={propertyId}
            onValueChange={setPropertyId}
            placeholder={t('agenda:propertiesManager.placeholder')}
            searchPlaceholder={t('agenda:propertiesManager.searchPlaceholder')}
          />
        </div>
        <Button type="button" onClick={addProperty}>
          {t('agenda:propertiesManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventPropertiesManager
