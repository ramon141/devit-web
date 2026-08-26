import { useState } from 'react'
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
  const [deleteTarget, setDeleteTarget] = useState<RentalContractWithRelations | null>(null)
  const [renewTarget, setRenewTarget] = useState<RentalContractWithRelations | null>(null)
  const [terminateTarget, setTerminateTarget] = useState<RentalContractWithRelations | null>(null)
  const { handleDelete } = useDeleteRentalContract()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildRentalTableColumns({
    onEdit,
    onRenew: setRenewTarget,
    onTerminate: setTerminateTarget,
    onDelete: setDeleteTarget,
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun contratto trovato."
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
