import { useState } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import itLocale from '@fullcalendar/core/locales/it'
import type { EventClickArg, EventDropArg, DatesSetArg } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import AppLayout from '@/components/layout/AppLayout'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { CalendarEvent } from '@/api/generated/models'
import { useCalendarEventList } from '@/pages/Agenda/hooks/useCalendarEventList'
import { useDeleteCalendarEvent } from '@/pages/Agenda/hooks/useDeleteCalendarEvent'
import { useRescheduleCalendarEvent } from '@/pages/Agenda/hooks/useRescheduleCalendarEvent'
import CalendarEventFormModal from '@/pages/Agenda/components/CalendarEventFormModal'
import CalendarEventPreviewModal from '@/pages/Agenda/components/CalendarEventPreviewModal'

const confirmationColors: Record<string, string> = {
  pending: 'var(--muted-foreground)',
  confirmed: 'var(--primary)',
  cancelled: 'var(--destructive)',
}

function Agenda() {
  const { t } = useTranslation('agenda')
  const { events, setRange } = useCalendarEventList()
  const { handleDelete } = useDeleteCalendarEvent()
  const { reschedule } = useRescheduleCalendarEvent()
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [previewEvent, setPreviewEvent] = useState<CalendarEvent | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CalendarEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startAt,
    end: event.endAt,
    allDay: event.allDay ?? false,
    backgroundColor: event.backgroundColor ?? confirmationColors[event.confirmationStatus ?? 'pending'],
    borderColor: 'transparent',
    textColor: event.confirmationStatus === 'confirmed' ? 'var(--primary-foreground)' : '#fff',
    extendedProps: { event },
  }))

  function handleDatesSet(arg: DatesSetArg) {
    setRange({ start: arg.start.toISOString(), end: arg.end.toISOString() })
  }

  function handleEventClick(arg: EventClickArg) {
    setPreviewEvent(arg.event.extendedProps.event as CalendarEvent)
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
      <div className="devit-calendar rounded-xl border border-border p-3">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          locales={[itLocale]}
          locale="it"
          height="auto"
          firstDay={1}
          nowIndicator
          editable
          selectable
          dayMaxEvents
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
