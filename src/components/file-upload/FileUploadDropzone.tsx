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
        'group flex cursor-pointer flex-col items-center justify-center gap-3',
        'rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-10 text-center',
        'transition-all duration-200 outline-none',
        'hover:border-primary hover:bg-accent',
        'focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40',
        isDragging && 'scale-[1.01] border-primary bg-accent',
        disabled && 'pointer-events-none opacity-50',
        error && 'border-destructive bg-destructive/5'
      )}
    >
      <div
        className={cn(
          'flex size-14 items-center justify-center rounded-full bg-background shadow-sm',
          'ring-1 ring-border transition-transform duration-200 group-hover:-translate-y-0.5',
          isDragging && '-translate-y-1 ring-primary'
        )}
      >
        <CloudUpload className="size-7 text-primary" />
      </div>
      <p className="text-sm text-foreground">
        <span className="font-semibold text-primary underline-offset-4 group-hover:underline">
          {t('fileUpload.clickToUpload')}
        </span>{' '}
        {t('fileUpload.dragHint')}
      </p>
      {hint && (
        <p className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
          {hint}
        </p>
      )}

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
