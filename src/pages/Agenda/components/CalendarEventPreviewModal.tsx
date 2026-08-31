import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import { useCalendarEventPropertyControllerFind } from '@/api/generated/api'
import { getEventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import { formatDateTime } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

type CalendarEventPreviewModalProps = {
  event: CalendarEventWithRelations | null
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEventWithRelations) => void
}

function CalendarEventPreviewModal({ event, onOpenChange, onEdit }: CalendarEventPreviewModalProps) {
  const { t } = useTranslation('agenda')
  const eventTypeOptions = getEventTypeOptions(t)

  const { data: links } = useCalendarEventPropertyControllerFind(
    { filter: { where: { calendarEventId: event?.id ?? '' }, include: [{ relation: 'property' }] } },
    { query: { enabled: !!event?.id } }
  )

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
          {event.lead?.name && (
            <p className="text-sm">
              <span className="font-medium">{t('agenda:previewModal.clientLabel')}</span>{' '}
              {event.lead.name}
            </p>
          )}
          {event.owner?.name && (
            <p className="text-sm">
              <span className="font-medium">{t('agenda:previewModal.ownerLabel')}</span>{' '}
              {event.owner.name}
            </p>
          )}
          {(links ?? []).length > 0 && (
            <p className="text-sm">
              <span className="font-medium">{t('agenda:previewModal.propertiesLabel')}</span>{' '}
              {(links ?? [])
                .map((link) => `${link.property?.code ?? ''} · ${link.property?.title ?? ''}`)
                .join(', ')}
            </p>
          )}
          {event.createdBy?.fullName && (
            <p className="text-sm">
              <span className="font-medium">{t('agenda:previewModal.createdByLabel')}</span>{' '}
              {event.createdBy.fullName}
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
