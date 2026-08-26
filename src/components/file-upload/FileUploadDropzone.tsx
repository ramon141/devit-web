import type { DragEvent, RefObject } from 'react'
import { CloudUpload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type FileUploadDropzoneProps = {
  inputId: string
  inputRef: RefObject<HTMLInputElement | null>
  accept?: string
  multiple: boolean
  disabled: boolean
  error?: string
  hint?: string
  isDragging: boolean
  setIsDragging: (value: boolean) => void
  onFilesSelected: (files: FileList | null) => void
}

function FileUploadDropzone({
  inputId,
  inputRef,
  accept,
  multiple,
  disabled,
  error,
  hint,
  isDragging,
  setIsDragging,
  onFilesSelected,
}: FileUploadDropzoneProps) {
  const { t } = useTranslation('common')

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    onFilesSelected(event.dataTransfer.files)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-transparent px-4 py-8 text-center transition-colors',
        'hover:border-ring hover:bg-accent/40',
        isDragging && 'border-ring bg-accent/60',
        disabled && 'pointer-events-none opacity-50',
        error && 'border-destructive'
      )}
    >
      <CloudUpload className="size-6 text-muted-foreground" />
      <p className="text-sm text-foreground">
        <span className="font-medium text-primary">{t('fileUpload.clickToUpload')}</span>{' '}
        {t('fileUpload.dragHint')}
      </p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => onFilesSelected(event.target.files)}
      />
    </div>
  )
}

export default FileUploadDropzone
