import { Badge } from '@/components/ui/badge'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { formatDate } from '@/utils/formatDate'

type RegistrazioniTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
}

function RegistrazioniTable({ contracts, isLoading }: RegistrazioniTableProps) {
  const columns: DataTableColumn<RentalContractWithRelations>[] = [
    { header: 'Numero', cell: (contract) => <span className="font-medium">{contract.number}</span> },
    { header: 'Scadenza', cell: (contract) => formatDate(contract.renewalDueDate) },
    {
      header: 'Stato registrazione',
      cell: (contract) => (
        <Badge variant={contract.registeredAt ? 'secondary' : 'destructive'}>
          {contract.registeredAt ? 'Registrato' : 'Da registrare'}
        </Badge>
      ),
    },
    {
      header: 'Periodo',
      cell: (contract) => (
        <>
          {formatDate(contract.startDate)} – {formatDate(contract.endDate)}
        </>
      ),
    },
    { header: 'Immobile', cell: (contract) => contract.property?.code ?? '—' },
    { header: 'Inquilino', cell: (contract) => contract.tenant?.name ?? '—' },
  ]

  return (
    <DataTable
      columns={columns}
      data={contracts}
      keyExtractor={(contract) => contract.id ?? ''}
      isLoading={isLoading}
      emptyMessage="Nessun contratto da registrare o rinnovare."
    />
  )
}

export default RegistrazioniTable
