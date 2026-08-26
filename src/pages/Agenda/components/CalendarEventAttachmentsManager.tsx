import { useTranslation } from 'react-i18next'
import AttachmentListManager from '@/components/AttachmentListManager'
import { useCalendarEventAttachments } from '@/pages/Agenda/hooks/useCalendarEventAttachments'

type CalendarEventAttachmentsManagerProps = {
  calendarEventId: string
}

function CalendarEventAttachmentsManager({ calendarEventId }: CalendarEventAttachmentsManagerProps) {
  const { t } = useTranslation('agenda')
  const { attachments, uploadFiles, removeAttachment } = useCalendarEventAttachments(calendarEventId)

  const items = attachments.map((link) => ({
    id: link.id ?? '',
    url: link.attachment?.url,
    name: link.attachment?.originalName ?? link.attachmentId ?? '',
  }))

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:attachmentsManager.title')}</p>

      <AttachmentListManager
        items={items}
        onUpload={uploadFiles}
        onRemove={removeAttachment}
        emptyMessage={t('agenda:attachmentsManager.emptyMessage')}
      />
    </div>
  )
}

export default CalendarEventAttachmentsManager
