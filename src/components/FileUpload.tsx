import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import FileUploadDropzone from '@/components/file-upload/FileUploadDropzone'
import FileUploadList from '@/components/file-upload/FileUploadList'

const DEFAULT_MAX_SIZE_MB = 10

export type FileUploadProps = {
  label?: string
  value: File[]
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  maxSizeMb?: number
}

function FileUpload({
  label,
  value,
  onChange,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  error,
  hint,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
}: FileUploadProps) {
  const { t } = useTranslation('common')
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [sizeError, setSizeError] = useState<string | undefined>(undefined)

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const maxSizeBytes = maxSizeMb * 1024 * 1024
    const selected = Array.from(files)
    const oversized = selected.some((file) => file.size > maxSizeBytes)

    setSizeError(
      oversized ? t('fileUpload.maxSizeError', { size: maxSizeMb }) : undefined
    )

    const valid = selected.filter((file) => file.size <= maxSizeBytes)
    const first = valid[0]
    if (!first) return

    const next = multiple ? [...value, ...valid] : [first]
    onChange(next)
  }

  function removeFile(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <FileUploadDropzone
        inputId={inputId}
        inputRef={inputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        error={error ?? sizeError}
        hint={hint ?? t('fileUpload.maxSizeHint', { size: maxSizeMb })}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onFilesSelected={addFiles}
      />

      <FileUploadList
        files={value}
        disabled={disabled}
        onRemove={removeFile}
      />

      {(error ?? sizeError) && (
        <p className="text-sm text-destructive">{error ?? sizeError}</p>
      )}
    </div>
  )
}

export default FileUpload
