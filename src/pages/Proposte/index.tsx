import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalList } from '@/pages/Proposte/hooks/useProposalList'
import { useEditModalState } from '@/hooks/useEditModalState'
import ProposalTable from '@/pages/Proposte/components/ProposalTable'
import ProposalFormModal from '@/pages/Proposte/components/ProposalFormModal'

function Proposte() {
  const { t } = useTranslation('proposte')
  const { proposals, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useProposalList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<PurchaseProposalWithRelations>()

  return (
    <AppLayout
      title={t('page.title')}
      description={t('page.description')}
      breadcrumbItems={[{ label: t('page.breadcrumb') }]}
    >
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('page.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('page.newLabel')}
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
