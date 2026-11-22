import type { EventContentArg } from '@fullcalendar/core'
import { Check, Phone } from 'lucide-react'
import { CalendarEventType, type CalendarEventWithRelations } from '@/api/generated/models'
import { getUserColor } from '@/pages/Agenda/utils/eventColors'
import { EVENT_ORIGIN_ACRONYM } from '@/pages/Agenda/schemas/calendarEventSchema'

type CalendarEventChipProps = {
  arg: EventContentArg
}

function CalendarEventChip({ arg }: CalendarEventChipProps) {
  const event = arg.event.extendedProps.event as CalendarEventWithRelations
  const userColor = getUserColor(event.ownerId ?? event.createdById)

  // na visão lista o horário já tem coluna própria
  const showTime = !arg.view.type.startsWith('list') && arg.timeText

  const isCallDone = event.type === CalendarEventType.call_completed
  const isCallTodo = event.type === CalendarEventType.call_scheduled

  return (
    <div className={`flex w-full items-center gap-1 overflow-hidden ${isCallDone ? 'opacity-60' : ''}`}>
      {showTime && <span>{arg.timeText}</span>}

      <span
        className="size-2 shrink-0 rounded-full ring-1 ring-white"
        style={{ backgroundColor: userColor }}
      />

      {event.origin && (
        <span className="shrink-0 rounded bg-white/30 px-1 text-[10px] font-semibold">
          {EVENT_ORIGIN_ACRONYM[event.origin]}
        </span>
      )}

      {isCallTodo && <Phone className="size-3 shrink-0" />}
      {isCallDone && <Check className="size-3 shrink-0" />}

      <span className={`truncate ${isCallDone ? 'line-through' : ''}`}>{arg.event.title}</span>
    </div>
  )
}

export default CalendarEventChip
