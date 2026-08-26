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
    { header: 'Numero', cell: (contract) => <span className="font-medium">{contract.number}</span> },
    { header: 'Immobile', cell: (contract) => contract.property?.code ?? '—' },
    { header: 'Inquilino', cell: (contract) => contract.tenant?.name ?? '—' },
    { header: 'Proprietario', cell: (contract) => contract.owner?.name ?? '—' },
    { header: 'Affitto attuale', cell: (contract) => formatAmount(contract.rentAmount) },
  ]

  return (
    <DataTable
      columns={columns}
      data={contracts}
      keyExtractor={(contract) => contract.id ?? ''}
      isLoading={isLoading}
      emptyMessage="Nessun contratto attivo trovato."
    />
  )
}

export default EligibleContractsTable
