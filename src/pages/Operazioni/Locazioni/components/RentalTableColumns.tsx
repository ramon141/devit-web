import type { TFunction } from 'i18next'
import { BanIcon, PencilIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { getRentalSituationOptions } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

function isLocked(situation?: string) {
  return situation === 'terminated' || situation === 'closed'
}

type BuildRentalTableColumnsProps = {
  onEdit: (contract: RentalContractWithRelations) => void
  onRenew: (contract: RentalContractWithRelations) => void
  onTerminate: (contract: RentalContractWithRelations) => void
  onDelete: (contract: RentalContractWithRelations) => void
}

function RentalTableActions({
  contract,
  onEdit,
  onRenew,
  onTerminate,
  onDelete,
}: { contract: RentalContractWithRelations } & BuildRentalTableColumnsProps) {
  const locked = isLocked(contract.situation)

  return (
    <>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onEdit(contract)}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onRenew(contract)}>
        <RefreshCwIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onTerminate(contract)}>
        <BanIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onDelete(contract)}>
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </>
  )
}

export function buildRentalTableColumns(
  props: BuildRentalTableColumnsProps,
  t: TFunction
): DataTableColumn<RentalContractWithRelations>[] {
  const situationOptions = getRentalSituationOptions(t)

  return [
    {
      header: t('operazioni:locazioni.tableColumns.numero'),
      cell: (contract) => <span className="font-medium">{contract.number}</span>,
    },
    {
      header: t('operazioni:locazioni.tableColumns.immobile'),
      cell: (contract) => contract.property?.code ?? '—',
    },
    {
      header: t('operazioni:locazioni.tableColumns.proprietario'),
      cell: (contract) => contract.owner?.name ?? '—',
    },
    {
      header: t('operazioni:locazioni.tableColumns.inquilino'),
      cell: (contract) => contract.tenant?.name ?? '—',
    },
    {
      header: t('operazioni:locazioni.tableColumns.affitto'),
      cell: (contract) => formatAmount(contract.rentAmount),
    },
    {
      header: t('operazioni:locazioni.tableColumns.inizio'),
      cell: (contract) => formatDate(contract.startDate),
    },
    {
      header: t('operazioni:locazioni.tableColumns.situazione'),
      cell: (contract) => (
        <Badge variant="secondary">{getOptionLabel(situationOptions, contract.situation)}</Badge>
      ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.azioni'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (contract) => <RentalTableActions contract={contract} {...props} />,
    },
  ]
}
