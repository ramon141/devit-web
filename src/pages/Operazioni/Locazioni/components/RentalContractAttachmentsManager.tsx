import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { useRentalContractAttachments } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractAttachments'

type RentalContractAttachmentsManagerProps = {
  contractId: string
}

function RentalContractAttachmentsManager({ contractId }: RentalContractAttachmentsManagerProps) {
  const { attachments, uploadFiles, removeAttachment } = useRentalContractAttachments(contractId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    if (files.length > 0) {
      uploadFiles(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <FileUpload label="Carica allegato" value={pendingFiles} onChange={handleChange} multiple />

      <div className="grid gap-2">
        {attachments.length === 0 && (
          <p className="text-sm text-muted-foreground">Nessun allegato caricato.</p>
        )}
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border"
          >
            {attachment.attachment?.url ? (
              <a
                href={attachment.attachment.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm font-medium underline"
              >
                {attachment.attachment?.originalName ?? attachment.attachmentId}
              </a>
            ) : (
              <span className="truncate text-sm font-medium">
                {attachment.attachment?.originalName ?? attachment.attachmentId}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => attachment.id && removeAttachment(attachment.id)}
            >
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RentalContractAttachmentsManager
