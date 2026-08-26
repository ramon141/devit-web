import { useState } from 'react'
import DataTable from '@/components/DataTable'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import RentalRenewModal from '@/pages/Operazioni/Locazioni/components/RentalRenewModal'
import { buildScadenziarioTableColumns } from '@/pages/Operazioni/Locazioni/Scadenziario/components/ScadenziarioTableColumns'

type ScadenziarioTableProps = {
  contracts: SalesRentalsReportControllerUpcomingRenewals200Item[]
  isLoading: boolean
}

function ScadenziarioTable({ contracts, isLoading }: ScadenziarioTableProps) {
  const [renewTarget, setRenewTarget] = useState<SalesRentalsReportControllerUpcomingRenewals200Item | null>(
    null
  )

  const columns = buildScadenziarioTableColumns({ onRenew: setRenewTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id ?? ''}
        isLoading={isLoading}
        emptyMessage="Nessun contratto in scadenza nel periodo selezionato."
      />

      <RentalRenewModal
        open={!!renewTarget}
        onOpenChange={(open) => !open && setRenewTarget(null)}
        contractId={renewTarget?.id}
        contractNumber={renewTarget?.number}
      />
    </>
  )
}

export default ScadenziarioTable
