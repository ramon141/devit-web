import { useState } from 'react'
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

const userColors = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#0891b2',
  '#db2777',
  '#65a30d',
  '#4f46e5',
  '#0d9488',
]

// ponytail: hash do id → cor fixa por usuário; colisões possíveis com >10 usuários
function getUserColor(userId: string | null | undefined) {
  if (!userId) return 'var(--muted-foreground)'

  let hash = 0
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0

  return userColors[hash % userColors.length]
}

const confirmationColors: Record<string, string> = {
  pending: '#9ca3af',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
}

function getEventColor(event: CalendarEventWithRelations) {
  return event.backgroundColor || confirmationColors[event.confirmationStatus ?? 'pending']
}

function renderEventContent(arg: EventContentArg) {
  const event = arg.event.extendedProps.event as CalendarEventWithRelations
  const userColor = getUserColor(event.ownerId ?? event.createdById)

  // na visão lista o horário já tem coluna própria
  const showTime = !arg.view.type.startsWith('list') && arg.timeText

  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {showTime && <span>{arg.timeText}</span>}

      <span
        className="size-2 shrink-0 rounded-full ring-1 ring-white"
        style={{ backgroundColor: userColor }}
      />

      <span className="truncate">{arg.event.title}</span>
    </div>
  )
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

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startAt,
    end: event.endAt,
    allDay: event.allDay ?? false,
    backgroundColor: getEventColor(event),
    borderColor: getEventColor(event),
    textColor: '#fff',
    extendedProps: { event },
  }))

  function handleDatesSet(arg: DatesSetArg) {
    setRange({ start: arg.start.toISOString(), end: arg.end.toISOString() })
  }

  function handleEventClick(arg: EventClickArg) {
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
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </div>

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
