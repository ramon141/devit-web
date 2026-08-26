import dayjs from 'dayjs'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { CalendarEvent } from '@/api/generated/models'
import { eventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import { formatDateTime } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

type CalendarEventPreviewModalProps = {
  event: CalendarEvent | null
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEvent) => void
}

function CalendarEventPreviewModal({ event, onOpenChange, onEdit }: CalendarEventPreviewModalProps) {
  return (
    <ModalRegister open={!!event} onOpenChange={onOpenChange} title={event?.title ?? ''}>
      {event && (
        <div className="grid w-full gap-3">
          <p className="text-sm text-muted-foreground">
            {formatDateTime(event.startAt)} – {dayjs(event.endAt).format('HH:mm')}
          </p>
          <p className="text-sm">
            <span className="font-medium">Tipo:</span> {getOptionLabel(eventTypeOptions, event.type)}
          </p>
          {event.place && (
            <p className="text-sm">
              <span className="font-medium">Luogo:</span> {event.place}
            </p>
          )}
          {event.description && <p className="text-sm">{event.description}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Chiudi
            </Button>
            <Button type="button" onClick={() => onEdit(event)}>
              Modifica
            </Button>
          </div>
        </div>
      )}
    </ModalRegister>
  )
}

export default CalendarEventPreviewModal
