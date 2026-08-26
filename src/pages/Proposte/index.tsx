import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalList } from '@/pages/Proposte/hooks/useProposalList'
import { useEditModalState } from '@/hooks/useEditModalState'
import ProposalTable from '@/pages/Proposte/components/ProposalTable'
import ProposalFormModal from '@/pages/Proposte/components/ProposalFormModal'

function Proposte() {
  const { proposals, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useProposalList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<PurchaseProposalWithRelations>()

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
        onNewClick={openNew}
        newLabel="Nuova proposta"
      />

      <ProposalTable proposals={proposals} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <ProposalFormModal open={open} onOpenChange={setOpen} proposal={editing} />
    </AppLayout>
  )
}

export default Proposte
