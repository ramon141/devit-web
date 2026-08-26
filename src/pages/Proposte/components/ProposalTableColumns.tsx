import dayjs from 'dayjs'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { proposalStatusOptions } from '@/pages/Proposte/schemas/proposalSchema'

function statusLabel(status?: string) {
  return proposalStatusOptions.find((option) => option.value === status)?.label ?? status ?? '—'
}

function isLocked(status?: string) {
  return status === 'accepted' || status === 'rejected'
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

type ProposalTableActionsProps = {
  proposal: PurchaseProposalWithRelations
  onEdit: (proposal: PurchaseProposalWithRelations) => void
  onDelete: (proposal: PurchaseProposalWithRelations) => void
}

function ProposalTableActions({ proposal, onEdit, onDelete }: ProposalTableActionsProps) {
  const locked = isLocked(proposal.status)

  return (
    <>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onEdit(proposal)}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onDelete(proposal)}>
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </>
  )
}

type BuildProposalTableColumnsProps = {
  onEdit: (proposal: PurchaseProposalWithRelations) => void
  onDelete: (proposal: PurchaseProposalWithRelations) => void
}

export function buildProposalTableColumns({
  onEdit,
  onDelete,
}: BuildProposalTableColumnsProps): DataTableColumn<PurchaseProposalWithRelations>[] {
  return [
    { header: 'Numero', cell: (proposal) => <span className="font-medium">{proposal.number}</span> },
    { header: 'Immobile', cell: (proposal) => proposal.property?.code ?? '—' },
    { header: 'Acquirente', cell: (proposal) => proposal.buyer?.name ?? '—' },
    { header: 'Valore', cell: (proposal) => formatAmount(proposal.proposalAmount) },
    { header: 'Data', cell: (proposal) => dayjs(proposal.proposalDate).format('DD/MM/YYYY') },
    {
      header: 'Stato',
      cell: (proposal) => <Badge variant="secondary">{statusLabel(proposal.status)}</Badge>,
    },
    {
      header: 'Azioni',
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (proposal) => (
        <ProposalTableActions proposal={proposal} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}
