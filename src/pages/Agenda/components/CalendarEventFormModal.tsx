import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { CalendarEvent } from '@/api/generated/models'
import { useCalendarEventForm } from '@/pages/Agenda/hooks/useCalendarEventForm'
import CalendarEventFormFields from '@/pages/Agenda/components/CalendarEventFormFields'

type CalendarEventFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent | null
  defaultDate?: string
  onRequestDelete?: (event: CalendarEvent) => void
}

function CalendarEventFormModal({
  open,
  onOpenChange,
  event,
  defaultDate,
  onRequestDelete,
}: CalendarEventFormModalProps) {
  const { form, isSubmitting, onSubmit } = useCalendarEventForm({
    event,
    defaultDate,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={event ? 'Modifica impegno' : 'Nuovo impegno'}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <CalendarEventFormFields form={form} />

        <div className="flex items-center justify-between gap-2">
          {event && onRequestDelete ? (
            <Button type="button" variant="ghost" className="text-destructive" onClick={() => onRequestDelete(event)}>
              Elimina
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salva
            </Button>
          </div>
        </div>
      </form>
    </ModalRegister>
  )
}

export default CalendarEventFormModal
