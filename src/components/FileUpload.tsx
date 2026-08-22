import { useId, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import FileUploadDropzone from '@/components/file-upload/FileUploadDropzone'
import FileUploadList from '@/components/file-upload/FileUploadList'

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
}: FileUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const next = multiple ? [...value, ...Array.from(files)] : [files[0]]
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
        error={error}
        hint={hint}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onFilesSelected={addFiles}
      />

      <FileUploadList
        files={value}
        disabled={disabled}
        onRemove={removeFile}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default FileUpload
