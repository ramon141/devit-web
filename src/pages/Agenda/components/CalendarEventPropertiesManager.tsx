import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
import { usePropertyControllerFind } from '@/api/generated/api'
import { useCalendarEventProperties } from '@/pages/Agenda/hooks/useCalendarEventProperties'

type CalendarEventPropertiesManagerProps = {
  calendarEventId: string
}

function CalendarEventPropertiesManager({ calendarEventId }: CalendarEventPropertiesManagerProps) {
  const { links, propertyId, setPropertyId, addProperty, removeProperty } =
    useCalendarEventProperties(calendarEventId)
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['title ASC'], limit: 200 } })
  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Immobili collegati</p>

      {links.map((link) => (
        <RemovableRow key={link.id} onRemove={() => link.id && removeProperty(link.id)}>
          <span className="text-sm">
            {link.property?.code} · {link.property?.title}
          </span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={propertyId}
            onValueChange={setPropertyId}
            options={propertyOptions}
            placeholder="Seleziona un immobile"
            searchPlaceholder="Cerca un immobile..."
          />
        </div>
        <Button type="button" onClick={addProperty}>
          Aggiungi
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventPropertiesManager
