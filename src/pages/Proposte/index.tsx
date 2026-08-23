import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalList } from '@/pages/Proposte/hooks/useProposalList'
import ProposalTable from '@/pages/Proposte/components/ProposalTable'
import ProposalFormModal from '@/pages/Proposte/components/ProposalFormModal'

function Proposte() {
  const { proposals, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useProposalList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingProposal, setEditingProposal] = useState<PurchaseProposalWithRelations | null>(
    null
  )

  function handleNew() {
    setEditingProposal(null)
    setFormOpen(true)
  }

  function handleEdit(proposal: PurchaseProposalWithRelations) {
    setEditingProposal(proposal)
    setFormOpen(true)
  }

  return (
    <AppLayout
      title="Proposte"
      description="Gestisci le proposte di acquisto ricevute"
      breadcrumbItems={[{ label: 'Proposte' }]}
    >
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca per numero..."
        onNewClick={handleNew}
        newLabel="Nuova proposta"
      />

      <ProposalTable proposals={proposals} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <ProposalFormModal open={formOpen} onOpenChange={setFormOpen} proposal={editingProposal} />
    </AppLayout>
  )
}

export default Proposte
