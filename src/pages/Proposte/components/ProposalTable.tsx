import { useState } from 'react'
import dayjs from 'dayjs'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { proposalStatusOptions } from '@/pages/Proposte/schemas/proposalSchema'
import { useDeleteProposal } from '@/pages/Proposte/hooks/useDeleteProposal'

type ProposalTableProps = {
  proposals: PurchaseProposalWithRelations[]
  isLoading: boolean
  onEdit: (proposal: PurchaseProposalWithRelations) => void
}

function statusLabel(status?: string) {
  return proposalStatusOptions.find((option) => option.value === status)?.label ?? status ?? '—'
}

function isLocked(status?: string) {
  return status === 'accepted' || status === 'rejected'
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function ProposalTable({ proposals, isLoading, onEdit }: ProposalTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PurchaseProposalWithRelations | null>(null)
  const { handleDelete } = useDeleteProposal()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numero</TableHead>
            <TableHead>Immobile</TableHead>
            <TableHead>Acquirente</TableHead>
            <TableHead>Valore</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && proposals.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                Nessuna proposta trovata.
              </TableCell>
            </TableRow>
          )}

          {proposals.map((proposal) => (
            <TableRow key={proposal.id}>
              <TableCell className="font-medium">{proposal.number}</TableCell>
              <TableCell>{proposal.property?.code ?? '—'}</TableCell>
              <TableCell>{proposal.buyer?.name ?? '—'}</TableCell>
              <TableCell>{formatAmount(proposal.proposalAmount)}</TableCell>
              <TableCell>{dayjs(proposal.proposalDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel(proposal.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(proposal.status)}
                  onClick={() => onEdit(proposal)}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(proposal.status)}
                  onClick={() => setDeleteTarget(proposal)}
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la proposta?"
        description={`Questa azione eliminerà definitivamente la proposta "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ProposalTable
