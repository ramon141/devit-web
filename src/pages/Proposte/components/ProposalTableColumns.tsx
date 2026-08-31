import { ArrowRightLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import type { TFunction } from 'i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { getProposalStatusOptions } from '@/pages/Proposte/schemas/proposalSchema'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

function isLocked(status?: string) {
  return status === 'accepted' || status === 'rejected'
}

type ProposalTableActionsProps = {
  proposal: PurchaseProposalWithRelations
  onEdit: (proposal: PurchaseProposalWithRelations) => void
  onDelete: (proposal: PurchaseProposalWithRelations) => void
  onConvert: (proposal: PurchaseProposalWithRelations) => void
  convertLabel: string
}

function ProposalTableActions({
  proposal,
  onEdit,
  onDelete,
  onConvert,
  convertLabel,
}: ProposalTableActionsProps) {
  const locked = isLocked(proposal.status)
  const canConvert = proposal.status === 'accepted' && !proposal.sale

  return (
    <>
      {canConvert && (
        <Button
          variant="ghost"
          size="icon-sm"
          title={convertLabel}
          onClick={() => onConvert(proposal)}
        >
          <ArrowRightLeftIcon className="size-4" />
        </Button>
      )}
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
  t: TFunction<'proposte'>
  onEdit: (proposal: PurchaseProposalWithRelations) => void
  onDelete: (proposal: PurchaseProposalWithRelations) => void
  onConvert: (proposal: PurchaseProposalWithRelations) => void
}

export function buildProposalTableColumns({
  t,
  onEdit,
  onDelete,
  onConvert,
}: BuildProposalTableColumnsProps): DataTableColumn<PurchaseProposalWithRelations>[] {
  const statusOptions = getProposalStatusOptions(t)

  return [
    {
      header: t('tableColumns.number'),
      cell: (proposal) => <span className="font-medium">{proposal.number}</span>,
    },
    { header: t('tableColumns.property'), cell: (proposal) => proposal.property?.code ?? '—' },
    { header: t('tableColumns.buyer'), cell: (proposal) => proposal.buyer?.name ?? '—' },
    { header: t('tableColumns.amount'), cell: (proposal) => formatAmount(proposal.proposalAmount) },
    { header: t('tableColumns.date'), cell: (proposal) => formatDate(proposal.proposalDate) },
    {
      header: t('tableColumns.status'),
      cell: (proposal) => (
        <Badge variant="secondary">{getOptionLabel(statusOptions, proposal.status)}</Badge>
      ),
    },
    {
      header: t('tableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (proposal) => (
        <ProposalTableActions
          proposal={proposal}
          onEdit={onEdit}
          onDelete={onDelete}
          onConvert={onConvert}
          convertLabel={t('convert.action')}
        />
      ),
    },
  ]
}
