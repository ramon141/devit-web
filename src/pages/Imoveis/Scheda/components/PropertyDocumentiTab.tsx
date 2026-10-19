import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadIcon } from 'lucide-react'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { formatDateTime } from '@/utils/formatDate'
import { usePropertyDocuments } from '@/pages/Imoveis/Scheda/hooks/usePropertyDocuments'

type PropertyDocumentiTabProps = {
  propertyId: string
}

function PropertyDocumentiTab({ propertyId }: PropertyDocumentiTabProps) {
  const { t } = useTranslation('imoveis')
  const { documents, uploadFiles, removeDocument } = usePropertyDocuments(propertyId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    setPendingFiles(files)
    if (files.length > 0) {
      uploadFiles(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <FileUpload
        label={t('scheda.documentiTab.uploadLabel')}
        value={pendingFiles}
        onChange={handleChange}
        multiple
      />

      <div className="grid gap-2">
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground">{t('scheda.documentiTab.empty')}</p>
        )}

        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 ring-1 ring-border">
            <div className="min-w-0">
              <p className="truncate text-sm">{doc.label ?? doc.attachment?.originalName}</p>
              {doc.createdAt && (
                <p className="text-xs text-muted-foreground">{formatDateTime(doc.createdAt)}</p>
              )}
            </div>

            <div className="flex shrink-0 gap-1">
              {doc.attachment?.url && (
                <Button variant="ghost" size="icon-sm" nativeButton={false} render={<a href={doc.attachment.url} target="_blank" rel="noreferrer" />}>
                  <DownloadIcon className="size-4" />
                </Button>
              )}
              <ConfirmDeleteButton
                name={doc.label ?? doc.attachment?.originalName ?? ''}
                onConfirm={() => doc.id && removeDocument(doc.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyDocumentiTab
