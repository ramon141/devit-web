import { useState } from 'react'
import { SaveIcon, Trash2Icon, XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import { useCalendarEventForm } from '@/pages/Agenda/hooks/useCalendarEventForm'
import CalendarEventFormFields from '@/pages/Agenda/components/CalendarEventFormFields'
import CalendarEventParticipantsManager from '@/pages/Agenda/components/CalendarEventParticipantsManager'
import CalendarEventPropertiesManager from '@/pages/Agenda/components/CalendarEventPropertiesManager'
import CalendarEventAttachmentsManager from '@/pages/Agenda/components/CalendarEventAttachmentsManager'
import CalendarEventOutcomeSection from '@/pages/Agenda/components/CalendarEventOutcomeSection'
import CalendarEventParticipantsDraftManager from '@/pages/Agenda/components/CalendarEventParticipantsDraftManager'
import CalendarEventPropertiesDraftManager from '@/pages/Agenda/components/CalendarEventPropertiesDraftManager'
import CalendarEventAttachmentsDraftManager from '@/pages/Agenda/components/CalendarEventAttachmentsDraftManager'
import CalendarEventOutcomeDraftSection from '@/pages/Agenda/components/CalendarEventOutcomeDraftSection'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

type CalendarEventFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEventWithRelations | null
  defaultDate?: string
  onRequestDelete?: (event: CalendarEventWithRelations) => void
}

function CalendarEventFormModal({
  open,
  onOpenChange,
  event,
  defaultDate,
  onRequestDelete,
}: CalendarEventFormModalProps) {
  const { t } = useTranslation('agenda')
  const [newClientOpen, setNewClientOpen] = useState(false)
  const { form, draft, isSubmitting, onSubmit } = useCalendarEventForm({
    event,
    defaultDate,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={event?.id ? t('agenda:formModal.editTitle') : t('agenda:formModal.createTitle')}
    >
      <form noValidate id="modal-agenda-form" onSubmit={onSubmit} className="grid gap-4">
        <CalendarEventFormFields form={form} />

        {event?.id ? (
          <>
            <Separator />
            <CalendarEventParticipantsManager calendarEventId={event.id} />
            <Separator />
            <CalendarEventPropertiesManager calendarEventId={event.id} />
            <Separator />
            <CalendarEventAttachmentsManager calendarEventId={event.id} />
            <Separator />
            <CalendarEventOutcomeSection calendarEventId={event.id} />
          </>
        ) : (
          <>
            <Separator />
            <CalendarEventParticipantsDraftManager
              participants={draft.participants}
              onAdd={draft.addParticipant}
              onRemove={draft.removeParticipant}
              onNewClient={() => setNewClientOpen(true)}
            />
            <Separator />
            <CalendarEventPropertiesDraftManager
              properties={draft.properties}
              onAdd={draft.addProperty}
              onRemove={draft.removeProperty}
            />
            <Separator />
            <CalendarEventAttachmentsDraftManager
              files={draft.attachmentFiles}
              onChange={draft.setAttachmentFiles}
            />
            <Separator />
            <CalendarEventOutcomeDraftSection
              outcomes={draft.outcomes}
              onAdd={draft.addOutcome}
              onRemove={draft.removeOutcome}
            />
          </>
        )}

        <div id="modal-btn-actions" className="flex items-center justify-between gap-2">
          {event && onRequestDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => onRequestDelete(event)}
            >
              <Trash2Icon data-icon="inline-start" />
              {t('agenda:formModal.delete')}
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <XIcon data-icon="inline-start" />
              {t('agenda:formModal.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <SaveIcon data-icon="inline-start" />
              {t('agenda:formModal.save')}
            </Button>
          </div>
        </div>
      </form>

      {/* fora do <form>: o submit do cadastro borbulha pelo portal e enviaria o compromisso */}
      <PersonFormModal
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onCreated={(created) => {
          if (!created.id) return

          draft.addParticipant({ personId: created.id, personName: created.name })
        }}
      />
    </ModalRegister>
  )
}

export default CalendarEventFormModal
