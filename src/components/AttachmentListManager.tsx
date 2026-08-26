import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import RemovableRow from '@/components/RemovableRow'

export type AttachmentListItem = {
  id: string
  url?: string | null
  name: string
  meta?: string
}

type AttachmentListManagerProps = {
  items: AttachmentListItem[]
  onUpload: (files: File[]) => void
  onRemove: (id: string) => void
  uploadLabel?: string
  emptyMessage?: string
}

function AttachmentRow({ item, onRemove }: { item: AttachmentListItem; onRemove: () => void }) {
  const label = (
    <>
      {item.name}
      {item.meta && ` · ${item.meta}`}
    </>
  )

  return (
    <RemovableRow onRemove={onRemove} icon={<Trash2Icon className="size-4 text-destructive" />}>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-sm font-medium underline"
        >
          {label}
        </a>
      ) : (
        <span className="truncate text-sm font-medium">{label}</span>
      )}
    </RemovableRow>
  )
}

function AttachmentListManager({
  items,
  onUpload,
  onRemove,
  uploadLabel = 'Carica allegato',
  emptyMessage = 'Nessun allegato caricato.',
}: AttachmentListManagerProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    if (files.length > 0) {
      onUpload(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <FileUpload label={uploadLabel} value={pendingFiles} onChange={handleChange} multiple />

      <div className="grid gap-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">{emptyMessage}</p>}

        {items.map((item) => (
          <AttachmentRow key={item.id} item={item} onRemove={() => onRemove(item.id)} />
        ))}
      </div>
    </div>
  )
}

export default AttachmentListManager
