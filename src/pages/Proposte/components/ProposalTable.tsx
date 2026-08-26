import { useState } from 'react'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useDeleteProposal } from '@/pages/Proposte/hooks/useDeleteProposal'
import { buildProposalTableColumns } from '@/pages/Proposte/components/ProposalTableColumns'

type ProposalTableProps = {
  proposals: PurchaseProposalWithRelations[]
  isLoading: boolean
  onEdit: (proposal: PurchaseProposalWithRelations) => void
}

function ProposalTable({ proposals, isLoading, onEdit }: ProposalTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PurchaseProposalWithRelations | null>(null)
  const { handleDelete } = useDeleteProposal()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildProposalTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={proposals}
        keyExtractor={(proposal) => proposal.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessuna proposta trovata."
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la proposta?"
        description={`Questa azione eliminerà definitivamente la proposta "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default ProposalTable
