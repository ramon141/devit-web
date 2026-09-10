import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { Lead, LeadStatus } from '@/api/generated/models'
import { leadStatusColors } from '@/pages/Clientes/Leads/schemas/leadSchema'
import LeadCard from '@/pages/Clientes/Leads/components/LeadCard'

type LeadColumnProps = {
  status: NonNullable<LeadStatus>
  label: string
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

function LeadColumn({ status, label, leads, onEdit, onDelete }: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const color = leadStatusColors[status]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'grid min-w-64 grid-cols-1 content-start gap-3 rounded-xl bg-white p-3 transition-colors',
        isOver && 'bg-primary/5 outline-2 -outline-offset-2 outline-dashed outline-primary'
      )}
    >
      {/* fundo = cor da página (muted/40 sobre background), esconde os cards nos cantos */}
      <div
        className={cn(
          'sticky top-0 z-10 -mx-3 -mt-3',
          'bg-[color-mix(in_oklab,var(--muted)_40%,var(--background))]'
        )}
      >
        <div
          className={cn(
            'relative flex items-center justify-between overflow-hidden',
            'rounded-t-xl bg-white px-4 pt-4 pb-2'
          )}
        >
          <span className={cn('absolute inset-x-0 top-0 h-1', color.dot)} />
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <span className={cn('size-2 rounded-full', color.dot)} />
            {label}
          </h3>
          <span className="text-xs text-muted-foreground">{leads.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

export default LeadColumn
