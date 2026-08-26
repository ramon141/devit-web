import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/DataTable'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useDeleteRentalContract } from '@/pages/Operazioni/Locazioni/hooks/useDeleteRentalContract'
import { buildRentalTableColumns } from '@/pages/Operazioni/Locazioni/components/RentalTableColumns'
import RentalTableModals from '@/pages/Operazioni/Locazioni/components/RentalTableModals'

type RentalTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
  onEdit: (contract: RentalContractWithRelations) => void
}

function RentalTable({ contracts, isLoading, onEdit }: RentalTableProps) {
  const { t } = useTranslation('operazioni')
  const [deleteTarget, setDeleteTarget] = useState<RentalContractWithRelations | null>(null)
  const [renewTarget, setRenewTarget] = useState<RentalContractWithRelations | null>(null)
  const [terminateTarget, setTerminateTarget] = useState<RentalContractWithRelations | null>(null)
  const { handleDelete } = useDeleteRentalContract()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildRentalTableColumns(
    {
      onEdit,
      onRenew: setRenewTarget,
      onTerminate: setTerminateTarget,
      onDelete: setDeleteTarget,
    },
    t
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('locazioni.table.emptyMessage')}
      />

      <RentalTableModals
        deleteTarget={deleteTarget}
        onDeleteTargetChange={setDeleteTarget}
        onConfirmDelete={confirmDelete}
        renewTarget={renewTarget}
        onRenewTargetChange={setRenewTarget}
        terminateTarget={terminateTarget}
        onTerminateTargetChange={setTerminateTarget}
      />
    </>
  )
}

export default RentalTable
