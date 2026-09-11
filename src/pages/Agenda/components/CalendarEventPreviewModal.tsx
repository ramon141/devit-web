import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import CalendarEventDetails from '@/pages/Agenda/components/CalendarEventDetails'

type CalendarEventPreviewModalProps = {
  event: CalendarEventWithRelations | null
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEventWithRelations) => void
}

function CalendarEventPreviewModal({ event, onOpenChange, onEdit }: CalendarEventPreviewModalProps) {
  const { t } = useTranslation('agenda')

  return (
    <ModalRegister
      open={!!event}
      onOpenChange={onOpenChange}
      title={event?.title ?? ''}
    >
      {event && (
        <div className="grid w-full gap-3">
          <CalendarEventDetails event={event} />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
