import AttachmentListManager from '@/components/AttachmentListManager'
import { useRentalContractAttachments } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractAttachments'

type RentalContractAttachmentsManagerProps = {
  contractId: string
}

function RentalContractAttachmentsManager({ contractId }: RentalContractAttachmentsManagerProps) {
  const { attachments, uploadFiles, removeAttachment } = useRentalContractAttachments(contractId)

  const items = attachments.map((attachment) => ({
    id: attachment.id ?? '',
    url: attachment.attachment?.url,
    name: attachment.attachment?.originalName ?? attachment.attachmentId ?? '',
  }))

  return (
    <AttachmentListManager
      items={items}
      onUpload={uploadFiles}
      onRemove={removeAttachment}
    />
  )
}

export default RentalContractAttachmentsManager
