import { useRef } from 'react'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import CalendarEventDetails from '@/pages/Agenda/components/CalendarEventDetails'
import CalendarEventHoverCardActions from '@/pages/Agenda/components/CalendarEventHoverCardActions'
import { getEventColor } from '@/pages/Agenda/utils/eventColors'
import { printElement } from '@/utils/printElement'
import { formatDate } from '@/utils/formatDate'

const CARD_WIDTH = 420
const CARD_MAX_HEIGHT = 460
const EDGE = 8
// card encosta no evento (sobrepondo 2px) pra não ter vão onde o mouse escapa
const OFFSET = -2

export type HoverCardState = {
  event: CalendarEventWithRelations
  rect: DOMRect
}

type CalendarEventHoverCardProps = {
  state: HoverCardState | null
  onMouseEnter: () => void
  onMouseLeave: () => void
  onEdit: (event: CalendarEventWithRelations) => void
  onDuplicate: (event: CalendarEventWithRelations) => void
  onAttachments: (event: CalendarEventWithRelations) => void
  onDelete: (event: CalendarEventWithRelations) => void
}

// mantém o card dentro da viewport: abre embaixo se não couber em cima
function getPosition(rect: DOMRect) {
  const left = Math.min(
    Math.max(EDGE, rect.left),
    Math.max(EDGE, window.innerWidth - CARD_WIDTH - EDGE)
  )

  const fitsAbove = rect.top > CARD_MAX_HEIGHT + EDGE

  return {
    left,
    top: fitsAbove ? undefined : rect.bottom + OFFSET,
    bottom: fitsAbove ? window.innerHeight - rect.top + OFFSET : undefined,
  }
}

function CalendarEventHoverCard({
  state,
  onMouseEnter,
  onMouseLeave,
  onEdit,
  onDuplicate,
  onAttachments,
  onDelete,
}: CalendarEventHoverCardProps) {
  const { t } = useTranslation('agenda')
  const cardRef = useRef<HTMLDivElement>(null)

  if (!state) return null

  const { event } = state
  const { left, top, bottom } = getPosition(state.rect)

  const timeRange = t('agenda:hoverCard.timeRange', {
    date: formatDate(event.startAt),
    start: dayjs(event.startAt).format('HH:mm'),
    end: dayjs(event.endAt).format('HH:mm'),
  })

  return createPortal(
    <div
      // key força a animação a rodar de novo ao passar direto de um evento pro outro
      key={event.id}
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-50 flex animate-in flex-col overflow-hidden rounded-lg border bg-card shadow-xl duration-150 fade-in-0 zoom-in-95"
      style={{
        left,
        top,
        bottom,
        width: CARD_WIDTH,
        maxHeight: CARD_MAX_HEIGHT,
      }}
    >
      <div
        className="flex items-start justify-between gap-3 px-3 py-2 text-white"
        style={{ backgroundColor: getEventColor(event) }}
      >
        <div className="min-w-0">
          <p className="truncate font-semibold">{event.title}</p>
          <p className="text-xs text-white/85">{timeRange}</p>
        </div>

        <CalendarEventHoverCardActions
          onEdit={() => onEdit(event)}
          onDuplicate={() => onDuplicate(event)}
          onPrint={() => cardRef.current && printElement(cardRef.current)}
          onAttachments={() => onAttachments(event)}
          onDelete={() => onDelete(event)}
        />
      </div>

      <div className="overflow-y-auto p-3">
        <CalendarEventDetails event={event} />
      </div>
    </div>,
    document.body
  )
}

export default CalendarEventHoverCard
