import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import AttachmentListManager from '@/components/AttachmentListManager'
import { useSaleDocuments } from '@/pages/Operazioni/Vendite/hooks/useSaleDocuments'
import { formatDateTime } from '@/utils/formatDate'

type SaleDocumentsManagerProps = {
  saleId: string
}

function SaleDocumentsManager({ saleId }: SaleDocumentsManagerProps) {
  const { t } = useTranslation('operazioni')
  const { documents, uploadFiles, removeDocument } = useSaleDocuments(saleId)
  const [type, setType] = useState('')

  function handleUpload(files: File[]) {
    uploadFiles(files, type)
    setType('')
  }

  const items = documents.map((document) => ({
    id: document.id ?? '',
    url: document.attachment?.url,
    name: document.attachment?.originalName ?? document.attachmentId ?? '',
    meta: [document.type, document.generatedAt && formatDateTime(document.generatedAt)]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <Input
          value={type}
          onChange={(event) => setType(event.target.value)}
          placeholder={t('vendite.documentsManager.typePlaceholder')}
          className="max-w-64"
        />
      </div>

      <AttachmentListManager
        items={items}
        onUpload={handleUpload}
        onRemove={removeDocument}
        uploadLabel={t('vendite.documentsManager.uploadLabel')}
        emptyMessage={t('vendite.documentsManager.emptyMessage')}
      />
    </div>
  )
}

export default SaleDocumentsManager
