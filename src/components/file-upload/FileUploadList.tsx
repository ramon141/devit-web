import { Paperclip, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type FileUploadListProps = {
  files: File[]
  disabled: boolean
  onRemove: (index: number) => void
}

function FileUploadList({ files, disabled, onRemove }: FileUploadListProps) {
  const { t } = useTranslation('common')

  if (files.length === 0) return null

  return (
    <ul className="grid gap-1.5">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
        >
          <Paperclip className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{file.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={disabled}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
            <span className="sr-only">
              {t('fileUpload.removeFile', { fileName: file.name })}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default FileUploadList
