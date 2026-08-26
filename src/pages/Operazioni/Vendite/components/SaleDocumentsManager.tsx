import { useState } from 'react'
import { Input } from '@/components/ui/input'
import AttachmentListManager from '@/components/AttachmentListManager'
import { useSaleDocuments } from '@/pages/Operazioni/Vendite/hooks/useSaleDocuments'
import { formatDateTime } from '@/utils/formatDate'

type SaleDocumentsManagerProps = {
  saleId: string
}

function SaleDocumentsManager({ saleId }: SaleDocumentsManagerProps) {
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
          placeholder="Tipo di documento (facoltativo)"
          className="max-w-64"
        />
      </div>

      <AttachmentListManager
        items={items}
        onUpload={handleUpload}
        onRemove={removeDocument}
        uploadLabel="Carica documento"
        emptyMessage="Nessun documento caricato."
      />
    </div>
  )
}

export default SaleDocumentsManager
