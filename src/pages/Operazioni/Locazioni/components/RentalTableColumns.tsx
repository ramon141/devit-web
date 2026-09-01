import type { ReactNode } from 'react'
import type { TFunction } from 'i18next'
import { BanIcon, PencilIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { DataTableColumn } from '@/components/DataTable'
import type {
  RentalContractOwnerWithRelations,
  RentalContractTenantWithRelations,
  RentalContractWithRelations,
} from '@/api/generated/models'
import { getRentalSituationOptions } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

function isLocked(situation?: string | null) {
  return situation === 'terminated' || situation === 'closed'
}

function partyNames(
  parties: {person?: {name?: string}}[] | undefined,
  fallback?: {name?: string},
): string {
  if (parties?.length) return parties.map((party) => party.person?.name ?? '—').join(', ')
  return fallback?.name ?? '—'
}

type BuildRentalTableColumnsProps = {
  onEdit: (contract: RentalContractWithRelations) => void
  onRenew: (contract: RentalContractWithRelations) => void
  onTerminate: (contract: RentalContractWithRelations) => void
  onDelete: (contract: RentalContractWithRelations) => void
}

function RentalTableActionButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={onClick}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function RentalTableActions({
  contract,
  onEdit,
  onRenew,
  onTerminate,
  onDelete,
  t,
}: { contract: RentalContractWithRelations; t: TFunction } & BuildRentalTableColumnsProps) {
  const locked = isLocked(contract.situation)

  const editLabel = locked
    ? t('operazioni:locazioni.tableColumns.lockedTooltip')
    : t('operazioni:locazioni.tableColumns.editTooltip')
  const renewLabel = locked
    ? t('operazioni:locazioni.tableColumns.lockedTooltip')
    : t('operazioni:locazioni.tableColumns.renewTooltip')
  const terminateLabel = locked
    ? t('operazioni:locazioni.tableColumns.lockedTooltip')
    : t('operazioni:locazioni.tableColumns.terminateTooltip')
  const deleteLabel = locked
    ? t('operazioni:locazioni.tableColumns.lockedTooltip')
    : t('operazioni:locazioni.tableColumns.deleteTooltip')

  return (
    <>
      <RentalTableActionButton label={editLabel} disabled={locked} onClick={() => onEdit(contract)}>
        <PencilIcon className="size-4" />
      </RentalTableActionButton>
      <RentalTableActionButton label={renewLabel} disabled={locked} onClick={() => onRenew(contract)}>
        <RefreshCwIcon className="size-4" />
      </RentalTableActionButton>
      <RentalTableActionButton
        label={terminateLabel}
        disabled={locked}
        onClick={() => onTerminate(contract)}
      >
        <BanIcon className="size-4" />
      </RentalTableActionButton>
      <RentalTableActionButton label={deleteLabel} disabled={locked} onClick={() => onDelete(contract)}>
        <Trash2Icon className="size-4 text-destructive" />
      </RentalTableActionButton>
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
      cell: (contract) =>
        partyNames(
          contract.rentalContractOwners as RentalContractOwnerWithRelations[] | undefined,
          contract.owner,
        ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.inquilino'),
      cell: (contract) =>
        partyNames(
          contract.rentalContractTenants as RentalContractTenantWithRelations[] | undefined,
          contract.tenant,
        ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.agenteProprietario'),
      cell: (contract) => contract.ownerAgent?.fullName ?? '—',
    },
    {
      header: t('operazioni:locazioni.tableColumns.agenteInquilino'),
      cell: (contract) => contract.tenantAgent?.fullName ?? '—',
    },
    {
      header: t('operazioni:locazioni.tableColumns.affitto'),
      cell: (contract) => formatAmount(contract.rentAmount),
    },
    {
      header: t('operazioni:locazioni.tableColumns.dataStipula'),
      cell: (contract) => formatDate(contract.stipulaDate),
    },
    {
      header: t('operazioni:locazioni.tableColumns.inizio'),
      cell: (contract) => formatDate(contract.startDate),
    },
    {
      header: t('operazioni:locazioni.tableColumns.al'),
      cell: (contract) => formatDate(contract.endDate),
    },
    {
      header: t('operazioni:locazioni.tableColumns.situazione'),
      cell: (contract) => (
        <Badge variant="secondary">{getOptionLabel(situationOptions, contract.situation)}</Badge>
      ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.inCorso'),
      cell: (contract) =>
        contract.situation === 'active' ? (
          <Badge>{t('operazioni:locazioni.tableColumns.inCorsoYes')}</Badge>
        ) : (
          '—'
        ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.reg'),
      cell: (contract) =>
        contract.registeredAt ? (
          <Badge variant="secondary">{t('operazioni:locazioni.tableColumns.regYes')}</Badge>
        ) : (
          '—'
        ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.note'),
      cell: (contract) => (
        <span className="block max-w-40 truncate" title={contract.notes ?? undefined}>
          {contract.notes ?? '—'}
        </span>
      ),
    },
    {
      header: t('operazioni:locazioni.tableColumns.azioni'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (contract) => <RentalTableActions contract={contract} t={t} {...props} />,
    },
  ]
}
