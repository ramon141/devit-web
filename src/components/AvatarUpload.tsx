import { useEffect, useId, useMemo, useRef } from 'react'
import { PencilIcon } from 'lucide-react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'

type AvatarUploadProps = {
  label?: string
  value: File[]
  onChange: (files: File[]) => void
  currentUrl?: string
  fallbackText?: string
  hint?: string
  disabled?: boolean
}

type AvatarUploadButtonProps = {
  imageUrl?: string
  fallbackText?: string
  disabled: boolean
  onClick: () => void
}

function AvatarUploadButton({ imageUrl, fallbackText, disabled, onClick }: AvatarUploadButtonProps) {
  return (
    <button
      type="button"
      className="relative rounded-full disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
    >
      <Avatar className="size-20">
        <AvatarImage src={imageUrl} alt={fallbackText} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>

      <AvatarBadge className="size-7 [&>svg]:size-3.5">
        <PencilIcon />
      </AvatarBadge>
    </button>
  )
}

function AvatarUpload({
  label,
  value,
  onChange,
  currentUrl,
  fallbackText,
  hint,
  disabled = false,
}: AvatarUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const file = value[0]

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(files: FileList | null) {
    const first = files?.[0]
    if (first) onChange([first])
  }

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <div className="flex flex-col items-center gap-2">
        <AvatarUploadButton
          imageUrl={previewUrl ?? currentUrl}
          fallbackText={fallbackText}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        />

        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => handleFileChange(event.target.files)}
      />
    </div>
  )
}

export default AvatarUpload
