import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
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
  uploadLabel,
  emptyMessage,
}: AttachmentListManagerProps) {
  const { t } = useTranslation('common')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [removeTarget, setRemoveTarget] = useState<AttachmentListItem | null>(null)
  const resolvedUploadLabel = uploadLabel ?? t('attachmentListManager.uploadLabel')
  const resolvedEmptyMessage = emptyMessage ?? t('attachmentListManager.emptyMessage')

  function handleChange(files: File[]) {
    if (files.length > 0) {
      onUpload(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <FileUpload label={resolvedUploadLabel} value={pendingFiles} onChange={handleChange} multiple />

      <div className="grid gap-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{resolvedEmptyMessage}</p>
        )}

        {items.map((item) => (
          <AttachmentRow key={item.id} item={item} onRemove={() => setRemoveTarget(item)} />
        ))}
      </div>

      <ConfirmPopup
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={t('attachmentListManager.deleteTitle')}
        description={t('attachmentListManager.deleteDescription', { name: removeTarget?.name })}
        variant="destructive"
        confirmLabel={t('attachmentListManager.deleteConfirm')}
        onConfirm={() => {
          if (removeTarget) onRemove(removeTarget.id)
          setRemoveTarget(null)
        }}
      />
    </div>
  )
}

export default AttachmentListManager
