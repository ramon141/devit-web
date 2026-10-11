import { useTranslation } from 'react-i18next'
import AttachmentListManager from '@/components/AttachmentListManager'
import { usePersonAttachments } from '@/pages/Clientes/Scheda/hooks/usePersonAttachments'

type SchedaAllegatiProps = {
  personId: string
}

function SchedaAllegati({ personId }: SchedaAllegatiProps) {
  const { t } = useTranslation('clientes')
  const { attachments, uploadFiles, removeAttachment } = usePersonAttachments(personId)

  const items = attachments.map((link) => ({
    id: link.id ?? '',
    url: link.attachment?.url,
    name: link.attachment?.originalName ?? link.attachmentId,
  }))

  return (
    <div id="cliente-scheda-allegati">
      <AttachmentListManager
        items={items}
        onUpload={uploadFiles}
        onRemove={removeAttachment}
        uploadLabel={t('schedaAllegati.uploadLabel')}
        emptyMessage={t('schedaAllegati.empty')}
      />
    </div>
  )
}

export default SchedaAllegati
