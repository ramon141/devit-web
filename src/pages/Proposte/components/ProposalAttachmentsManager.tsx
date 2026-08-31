import { useTranslation } from 'react-i18next'
import AttachmentListManager from '@/components/AttachmentListManager'
import { useProposalAttachments } from '@/pages/Proposte/hooks/useProposalAttachments'

type ProposalAttachmentsManagerProps = {
  proposalId: string
}

function ProposalAttachmentsManager({ proposalId }: ProposalAttachmentsManagerProps) {
  const { t } = useTranslation('proposte')
  const { attachments, uploadFiles, removeAttachment } = useProposalAttachments(proposalId)

  const items = attachments.map((attachment) => ({
    id: attachment.id ?? '',
    url: attachment.attachment?.url,
    name: attachment.attachment?.originalName ?? attachment.label ?? attachment.attachmentId,
  }))

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{t('attachments.title')}</p>
      <AttachmentListManager
        items={items}
        onUpload={uploadFiles}
        onRemove={removeAttachment}
        uploadLabel={t('attachments.uploadLabel')}
        emptyMessage={t('attachments.emptyMessage')}
      />
    </div>
  )
}

export default ProposalAttachmentsManager
