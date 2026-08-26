import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { CalendarEvent } from '@/api/generated/models'
import { getEventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import { formatDateTime } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

type CalendarEventPreviewModalProps = {
  event: CalendarEvent | null
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEvent) => void
}

function CalendarEventPreviewModal({ event, onOpenChange, onEdit }: CalendarEventPreviewModalProps) {
  const { t } = useTranslation('agenda')
  const eventTypeOptions = getEventTypeOptions(t)

  return (
    <ModalRegister open={!!event} onOpenChange={onOpenChange} title={event?.title ?? ''}>
      {event && (
        <div className="grid w-full gap-3">
          <p className="text-sm text-muted-foreground">
            {formatDateTime(event.startAt)} – {dayjs(event.endAt).format('HH:mm')}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('agenda:previewModal.typeLabel')}</span>{' '}
            {getOptionLabel(eventTypeOptions, event.type)}
          </p>
          {event.place && (
            <p className="text-sm">
              <span className="font-medium">{t('agenda:previewModal.placeLabel')}</span> {event.place}
            </p>
          )}
          {event.description && <p className="text-sm">{event.description}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('agenda:previewModal.close')}
            </Button>
            <Button type="button" onClick={() => onEdit(event)}>
              {t('agenda:previewModal.edit')}
            </Button>
          </div>
        </div>
      )}
    </ModalRegister>
  )
}

export default CalendarEventPreviewModal
