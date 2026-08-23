import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Lead } from '@/api/generated/models'

type LeadCardProps = {
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  isOverlay?: boolean
}

function LeadCard({ lead, onEdit, onDelete, isOverlay = false }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id ?? '',
    disabled: isOverlay,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'grid touch-none gap-2 rounded-lg bg-card p-3 ring-1 ring-border transition-shadow',
        isOverlay ? 'cursor-grabbing shadow-lg' : 'cursor-grab hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-medium">{lead.name}</p>
        <div className="flex shrink-0">
          <Button variant="ghost" size="icon-xs" onClick={() => onEdit(lead)}>
            <PencilIcon className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => onDelete(lead)}>
            <Trash2Icon className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>

      {lead.phone && <p className="text-xs text-muted-foreground">{lead.phone}</p>}
      {lead.email && <p className="text-xs text-muted-foreground">{lead.email}</p>}
    </div>
  )
}

export default LeadCard
