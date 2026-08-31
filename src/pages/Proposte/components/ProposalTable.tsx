import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useDeleteProposal } from '@/pages/Proposte/hooks/useDeleteProposal'
import { useConvertProposal } from '@/pages/Proposte/hooks/useConvertProposal'
import { buildProposalTableColumns } from '@/pages/Proposte/components/ProposalTableColumns'

type ProposalTableProps = {
  proposals: PurchaseProposalWithRelations[]
  isLoading: boolean
  onEdit: (proposal: PurchaseProposalWithRelations) => void
}

function ProposalTable({ proposals, isLoading, onEdit }: ProposalTableProps) {
  const { t } = useTranslation('proposte')
  const [deleteTarget, setDeleteTarget] = useState<PurchaseProposalWithRelations | null>(null)
  const [convertTarget, setConvertTarget] = useState<PurchaseProposalWithRelations | null>(null)
  const { handleDelete } = useDeleteProposal()
  const { convert } = useConvertProposal()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  function confirmConvert() {
    if (convertTarget?.id) convert(convertTarget.id)
    setConvertTarget(null)
  }

  const columns = buildProposalTableColumns({
    t,
    onEdit,
    onDelete: setDeleteTarget,
    onConvert: setConvertTarget,
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={proposals}
        keyExtractor={(proposal) => proposal.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('table.emptyMessage')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('table.deleteTitle')}
        description={t('table.deleteDescription', { number: deleteTarget?.number })}
        variant="destructive"
        confirmLabel={t('table.deleteConfirmLabel')}
        onConfirm={confirmDelete}
      />

      <ConfirmPopup
        open={!!convertTarget}
        onOpenChange={(open) => !open && setConvertTarget(null)}
        title={t('convert.confirmTitle')}
        description={t('convert.confirmDescription', { number: convertTarget?.number })}
        confirmLabel={t('convert.confirmLabel')}
        onConfirm={confirmConvert}
      />
    </>
  )
}

export default ProposalTable
