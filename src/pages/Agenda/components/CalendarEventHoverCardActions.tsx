import { useTranslation } from 'react-i18next'
import { Copy, FileText, Pencil, Printer, Trash2 } from 'lucide-react'

type CalendarEventHoverCardActionsProps = {
  onEdit: () => void
  onDuplicate: () => void
  onPrint: () => void
  onAttachments: () => void
  onDelete: () => void
}

type ActionButtonProps = {
  label: string
  onClick: () => void
  children: React.ReactNode
}

function ActionButton({ label, onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded p-1 text-white/90 transition-colors hover:bg-white/20 hover:text-white"
    >
      {children}
    </button>
  )
}

function CalendarEventHoverCardActions({
  onEdit,
  onDuplicate,
  onPrint,
  onAttachments,
  onDelete,
}: CalendarEventHoverCardActionsProps) {
  const { t } = useTranslation('agenda')

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <ActionButton label={t('agenda:hoverCard.edit')} onClick={onEdit}>
        <Pencil className="size-4" />
      </ActionButton>

      <ActionButton label={t('agenda:hoverCard.duplicate')} onClick={onDuplicate}>
        <Copy className="size-4" />
      </ActionButton>

      <ActionButton label={t('agenda:hoverCard.print')} onClick={onPrint}>
        <Printer className="size-4" />
      </ActionButton>

      <ActionButton label={t('agenda:hoverCard.attachments')} onClick={onAttachments}>
        <FileText className="size-4" />
      </ActionButton>

      <ActionButton label={t('agenda:hoverCard.delete')} onClick={onDelete}>
        <Trash2 className="size-4" />
      </ActionButton>
    </div>
  )
}

export default CalendarEventHoverCardActions
