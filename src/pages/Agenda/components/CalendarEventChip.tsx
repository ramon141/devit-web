import type { EventContentArg } from '@fullcalendar/core'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import { getUserColor } from '@/pages/Agenda/utils/eventColors'

type CalendarEventChipProps = {
  arg: EventContentArg
}

function CalendarEventChip({ arg }: CalendarEventChipProps) {
  const event = arg.event.extendedProps.event as CalendarEventWithRelations
  const userColor = getUserColor(event.ownerId ?? event.createdById)

  // na visão lista o horário já tem coluna própria
  const showTime = !arg.view.type.startsWith('list') && arg.timeText

  return (
    <div className="flex w-full items-center gap-1 overflow-hidden">
      {showTime && <span>{arg.timeText}</span>}

      <span
        className="size-2 shrink-0 rounded-full ring-1 ring-white"
        style={{ backgroundColor: userColor }}
      />

      <span className="truncate">{arg.event.title}</span>
    </div>
  )
}

export default CalendarEventChip
