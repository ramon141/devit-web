import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
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
        <div key={link.id} className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
          <span className="text-sm">
            {link.property?.code} · {link.property?.title}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => link.id && removeProperty(link.id)}>
            <XIcon className="size-4" />
          </Button>
        </div>
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
