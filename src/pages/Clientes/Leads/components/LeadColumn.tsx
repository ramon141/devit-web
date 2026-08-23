import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { Lead } from '@/api/generated/models'
import LeadCard from '@/pages/Clientes/Leads/components/LeadCard'

type LeadColumnProps = {
  status: string
  label: string
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

function LeadColumn({ status, label, leads, onEdit, onDelete }: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'grid min-w-64 gap-3 rounded-xl border-2 border-transparent bg-muted/40 p-3 transition-colors',
        isOver && 'border-dashed border-primary bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-muted-foreground">{leads.length}</span>
      </div>

      <div className="grid gap-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

export default LeadColumn
