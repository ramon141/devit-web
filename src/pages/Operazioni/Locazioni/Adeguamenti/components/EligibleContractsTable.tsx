import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'

type EligibleContractsTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
  selectedIds: string[]
  onToggle: (id: string) => void
}

function EligibleContractsTable({ contracts, isLoading, selectedIds, onToggle }: EligibleContractsTableProps) {
  const { t } = useTranslation('operazioni')

  const columns: DataTableColumn<RentalContractWithRelations>[] = [
    {
      header: '',
      cell: (contract) => (
        <Checkbox
          checked={!!contract.id && selectedIds.includes(contract.id)}
          onCheckedChange={() => contract.id && onToggle(contract.id)}
        />
      ),
    },
    {
      header: t('locazioni.adeguamenti.eligibleTable.numero'),
      cell: (contract) => <span className="font-medium">{contract.number}</span>,
    },
    {
      header: t('locazioni.adeguamenti.eligibleTable.immobile'),
      cell: (contract) => contract.property?.code ?? '—',
    },
    {
      header: t('locazioni.adeguamenti.eligibleTable.inquilino'),
      cell: (contract) => contract.tenant?.name ?? '—',
    },
    {
      header: t('locazioni.adeguamenti.eligibleTable.proprietario'),
      cell: (contract) => contract.owner?.name ?? '—',
    },
    {
      header: t('locazioni.adeguamenti.eligibleTable.affittoAttuale'),
      cell: (contract) => formatAmount(contract.rentAmount),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={contracts}
      keyExtractor={(contract) => contract.id ?? ''}
      isLoading={isLoading}
      emptyMessage={t('locazioni.adeguamenti.eligibleTable.emptyMessage')}
    />
  )
}

export default EligibleContractsTable
