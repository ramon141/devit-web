import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/FileUpload'
import { useSaleDocuments } from '@/pages/Operazioni/Vendite/hooks/useSaleDocuments'
import { formatDateTime } from '@/utils/formatDate'

type SaleDocumentsManagerProps = {
  saleId: string
}

function SaleDocumentsManager({ saleId }: SaleDocumentsManagerProps) {
  const { documents, uploadFiles, removeDocument } = useSaleDocuments(saleId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [type, setType] = useState('')

  function handleChange(files: File[]) {
    if (files.length > 0) {
      uploadFiles(files, type)
      setPendingFiles([])
      setType('')
    }
  }

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

      <FileUpload label="Carica documento" value={pendingFiles} onChange={handleChange} multiple />

      <div className="grid gap-2">
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground">Nessun documento caricato.</p>
        )}
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border"
          >
            <div className="min-w-0">
              {document.attachment?.url ? (
                <a
                  href={document.attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium underline"
                >
                  {document.attachment?.originalName ?? document.attachmentId}
                </a>
              ) : (
                <span className="truncate text-sm font-medium">
                  {document.attachment?.originalName ?? document.attachmentId}
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                {document.type && `${document.type} · `}
                {document.generatedAt && formatDateTime(document.generatedAt)}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => document.id && removeDocument(document.id)}>
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SaleDocumentsManager
