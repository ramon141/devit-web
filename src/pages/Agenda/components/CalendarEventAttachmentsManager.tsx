import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { useCalendarEventAttachments } from '@/pages/Agenda/hooks/useCalendarEventAttachments'

type CalendarEventAttachmentsManagerProps = {
  calendarEventId: string
}

function CalendarEventAttachmentsManager({ calendarEventId }: CalendarEventAttachmentsManagerProps) {
  const { attachments, uploadFiles, removeAttachment } = useCalendarEventAttachments(calendarEventId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    setPendingFiles(files)
    if (files.length > 0) {
      uploadFiles(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Scheda di visualizzazione</p>

      <FileUpload label="Carica allegato" value={pendingFiles} onChange={handleChange} multiple />

      <div className="grid gap-2">
        {attachments.length === 0 && <p className="text-sm text-muted-foreground">Nessun allegato.</p>}
        {attachments.map((link) => (
          <div key={link.id} className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
            <span className="truncate text-sm">{link.attachment?.originalName ?? link.attachmentId}</span>
            <Button variant="ghost" size="icon-sm" onClick={() => link.id && removeAttachment(link.id)}>
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarEventAttachmentsManager
