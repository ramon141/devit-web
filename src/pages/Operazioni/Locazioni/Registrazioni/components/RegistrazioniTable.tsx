import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { formatDate } from '@/utils/formatDate'

type RegistrazioniTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
}

function RegistrazioniTable({ contracts, isLoading }: RegistrazioniTableProps) {
  const { t } = useTranslation('operazioni')

  const columns: DataTableColumn<RentalContractWithRelations>[] = [
    {
      header: t('locazioni.registrazioni.table.numero'),
      cell: (contract) => <span className="font-medium">{contract.number}</span>,
    },
    {
      header: t('locazioni.registrazioni.table.scadenza'),
      cell: (contract) => formatDate(contract.renewalDueDate),
    },
    {
      header: t('locazioni.registrazioni.table.statoRegistrazione'),
      cell: (contract) => (
        <Badge variant={contract.registeredAt ? 'secondary' : 'destructive'}>
          {contract.registeredAt
            ? t('locazioni.registrazioni.table.registrato')
            : t('locazioni.registrazioni.table.daRegistrare')}
        </Badge>
      ),
    },
    {
      header: t('locazioni.registrazioni.table.periodo'),
      cell: (contract) => (
        <>
          {formatDate(contract.startDate)} – {formatDate(contract.endDate)}
        </>
      ),
    },
    {
      header: t('locazioni.registrazioni.table.immobile'),
      cell: (contract) => contract.property?.code ?? '—',
    },
    {
      header: t('locazioni.registrazioni.table.inquilino'),
      cell: (contract) => contract.tenant?.name ?? '—',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={contracts}
      keyExtractor={(contract) => contract.id ?? ''}
      isLoading={isLoading}
      emptyMessage={t('locazioni.registrazioni.table.emptyMessage')}
    />
  )
}

export default RegistrazioniTable
