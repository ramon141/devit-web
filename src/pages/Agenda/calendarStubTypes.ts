import type { EventInput } from '@fullcalendar/core'
import type { CalendarEventWithRelations } from '@/api/generated/models'

// Formato mínimo dos eventos do calendário que a tela realmente lê
type MoveArg = {
  event: { id: string; start: Date; end: Date }
  revert: () => void
}

export type CalendarStubProps = {
  events?: EventInput[]
  dateClick?: (arg: { dateStr: string }) => void
  eventClick?: (arg: { event: { extendedProps: { event: CalendarEventWithRelations } } }) => void
  eventDrop?: (arg: MoveArg) => void
  eventResize?: (arg: MoveArg) => void
}
