import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/DataTable'
import type { SalesRentalsReportControllerUpcomingRenewals200Item } from '@/api/generated/models'
import RentalRenewModal from '@/pages/Operazioni/Locazioni/components/RentalRenewModal'
import { buildScadenziarioTableColumns } from '@/pages/Operazioni/Locazioni/Scadenziario/components/ScadenziarioTableColumns'

type ScadenziarioTableProps = {
  contracts: SalesRentalsReportControllerUpcomingRenewals200Item[]
  isLoading: boolean
}

function ScadenziarioTable({ contracts, isLoading }: ScadenziarioTableProps) {
  const { t } = useTranslation('operazioni')
  const [renewTarget, setRenewTarget] = useState<SalesRentalsReportControllerUpcomingRenewals200Item | null>(
    null
  )

  const columns = buildScadenziarioTableColumns({ onRenew: setRenewTarget }, t)

  return (
    <>
      <DataTable
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('locazioni.scadenziario.table.emptyMessage')}
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
