import { useCallback, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import itLocale from '@fullcalendar/core/locales/it'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import type {
  EventClickArg,
  EventHoveringArg,
  EventContentArg,
  EventDropArg,
  DatesSetArg,
} from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import AppLayout from '@/components/layout/AppLayout'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import { useCalendarEventList } from '@/pages/Agenda/hooks/useCalendarEventList'
import { useDeleteCalendarEvent } from '@/pages/Agenda/hooks/useDeleteCalendarEvent'
import { useRescheduleCalendarEvent } from '@/pages/Agenda/hooks/useRescheduleCalendarEvent'
import CalendarEventFormModal from '@/pages/Agenda/components/CalendarEventFormModal'
import CalendarEventPreviewModal from '@/pages/Agenda/components/CalendarEventPreviewModal'
import AgendaFilters from '@/pages/Agenda/components/AgendaFilters'
import CalendarEventChip from '@/pages/Agenda/components/CalendarEventChip'
import CalendarEventHoverCard from '@/pages/Agenda/components/CalendarEventHoverCard'
import type { HoverCardState } from '@/pages/Agenda/components/CalendarEventHoverCard'
import { getEventColor } from '@/pages/Agenda/utils/eventColors'

// fora do componente: identidade estável, senão o FullCalendar recria os eventos a cada render
function renderEventContent(arg: EventContentArg) {
  return <CalendarEventChip arg={arg} />
}

function Agenda() {
  const { t, i18n } = useTranslation('agenda')
  const { events, setRange, filters, setFilters } = useCalendarEventList()
  const { handleDelete } = useDeleteCalendarEvent()
  const { reschedule } = useRescheduleCalendarEvent()
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEventWithRelations | null>(null)
  const [previewEvent, setPreviewEvent] = useState<CalendarEventWithRelations | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CalendarEventWithRelations | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)
  const [hoverCard, setHoverCard] = useState<HoverCardState | null>(null)
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const overCard = useRef(false)

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.startAt,
        end: event.endAt,
        allDay: event.allDay ?? false,
        backgroundColor: getEventColor(event),
        borderColor: getEventColor(event),
        textColor: '#fff',
        extendedProps: { event },
      })),
    [events]
  )

  // pequeno atraso pra dar tempo de levar o mouse do evento até o card
  const scheduleHoverClose = useCallback(() => {
    // o mouseleave do evento chega depois do mouseenter do card; nesse caso não fecha
    if (overCard.current) return

    clearTimeout(hoverOpenTimer.current)
    clearTimeout(hoverCloseTimer.current)
    hoverCloseTimer.current = setTimeout(() => setHoverCard(null), 200)
  }, [])

  // fechar pelo código não dispara mouseleave, então a flag precisa ser limpa aqui
  const closeHoverCard = useCallback(() => {
    overCard.current = false
    clearTimeout(hoverOpenTimer.current)
    clearTimeout(hoverCloseTimer.current)
    setHoverCard(null)
  }, [])

  const handleCardMouseEnter = useCallback(() => {
    overCard.current = true
    clearTimeout(hoverOpenTimer.current)
    clearTimeout(hoverCloseTimer.current)
  }, [])

  const handleCardMouseLeave = useCallback(() => {
    overCard.current = false
    scheduleHoverClose()
  }, [scheduleHoverClose])

  const handleEventMouseEnter = useCallback((arg: EventHoveringArg) => {
    // com o mouse dentro do card, eventos por baixo não roubam o hover
    if (overCard.current) return

    const event = arg.event.extendedProps.event as CalendarEventWithRelations
    const rect = arg.el.getBoundingClientRect()

    clearTimeout(hoverCloseTimer.current)
    clearTimeout(hoverOpenTimer.current)

    // atraso na abertura: passar rápido por cima de um evento não troca o card
    hoverOpenTimer.current = setTimeout(() => setHoverCard({ event, rect }), 250)
  }, [])

  function openEventForm(event: CalendarEventWithRelations) {
    closeHoverCard()
    setEditingEvent(event)
    setFormOpen(true)
  }

  function handleDuplicate(event: CalendarEventWithRelations) {
    openEventForm({ ...event, id: undefined, title: event.title })
  }

  function handleDatesSet(arg: DatesSetArg) {
    closeHoverCard()
    setRange({ start: arg.start.toISOString(), end: arg.end.toISOString() })
  }

  function handleEventClick(arg: EventClickArg) {
    closeHoverCard()
    setPreviewEvent(arg.event.extendedProps.event as CalendarEventWithRelations)
  }

  function handleDateClick(dateStr: string) {
    setEditingEvent(null)
    setDefaultDate(dateStr)
    setFormOpen(true)
  }

  function handleEventDrop(arg: EventDropArg) {
    if (!arg.event.id || !arg.event.start || !arg.event.end) return

    reschedule(arg.event.id, arg.event.start.toISOString(), arg.event.end.toISOString()).catch(() =>
      arg.revert()
    )
  }

  function handleEventResize(arg: EventResizeDoneArg) {
    if (!arg.event.id || !arg.event.start || !arg.event.end) return

    reschedule(arg.event.id, arg.event.start.toISOString(), arg.event.end.toISOString()).catch(() =>
      arg.revert()
    )
  }

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <AppLayout
      title={t('agenda:page.title')}
      description={t('agenda:page.description')}
      breadcrumbItems={[{ label: t('agenda:page.breadcrumb') }]}
    >
      <AgendaFilters filters={filters} onChange={setFilters} />

      <div className="devit-calendar rounded-xl bg-card p-3">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          locales={[itLocale, ptLocale]}
          locale={i18n.language === 'pt' ? 'pt-br' : 'it'}
          height="auto"
          firstDay={1}
          nowIndicator
          editable
          selectable
          dayMaxEvents
          eventDisplay="block"
          eventContent={renderEventContent}
          events={calendarEvents}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          dateClick={(arg) => handleDateClick(arg.dateStr)}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={scheduleHoverClose}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </div>

      <CalendarEventHoverCard
        state={hoverCard}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        onEdit={openEventForm}
        onDuplicate={handleDuplicate}
        // ponytail: os anexos vivem dentro do modal de edição
        onAttachments={openEventForm}
        onDelete={(event) => {
          closeHoverCard()
          setDeleteTarget(event)
        }}
      />

      <CalendarEventPreviewModal
        event={previewEvent}
        onOpenChange={(open) => !open && setPreviewEvent(null)}
        onEdit={(event) => {
          setPreviewEvent(null)
          setEditingEvent(event)
          setFormOpen(true)
        }}
      />

      <CalendarEventFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        defaultDate={defaultDate ?? dayjs().format('YYYY-MM-DD')}
        onRequestDelete={(event) => {
          setFormOpen(false)
          setDeleteTarget(event)
        }}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('agenda:page.deleteEventTitle')}
        description={t('agenda:page.deleteEventDescription', { title: deleteTarget?.title })}
        variant="destructive"
        confirmLabel={t('agenda:page.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  )
}

export default Agenda
