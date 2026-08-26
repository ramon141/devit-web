import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { Branch } from '@/api/generated/models'
import { useDeleteBranch } from '@/pages/Amministrazione/Filiali/hooks/useDeleteBranch'
import { buildBranchTableColumns } from '@/pages/Amministrazione/Filiali/components/BranchTableColumns'

type BranchTableProps = {
  branches: Branch[]
  isLoading: boolean
  onEdit: (branch: Branch) => void
}

function BranchTable({ branches, isLoading, onEdit }: BranchTableProps) {
  const { t } = useTranslation('amministrazione')
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null)
  const { handleDelete } = useDeleteBranch()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildBranchTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={branches}
        keyExtractor={(branch) => branch.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('branchTable.empty')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('branchTable.deleteTitle')}
        description={t('branchTable.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('branchTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default BranchTable
