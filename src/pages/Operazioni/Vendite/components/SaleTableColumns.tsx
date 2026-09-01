import type { TFunction } from 'i18next'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DataTableColumn } from '@/components/DataTable'
import type { SaleWithRelations } from '@/api/generated/models'
import { getSaleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

function isLocked(status?: string) {
  return status === 'sold' || status === 'canceled'
}

type SaleTableActionsProps = {
  sale: SaleWithRelations
  onEdit: (sale: SaleWithRelations) => void
  onDelete: (sale: SaleWithRelations) => void
  t: TFunction
}

function SaleTableActions({ sale, onEdit, onDelete, t }: SaleTableActionsProps) {
  const locked = isLocked(sale.status)

  const actions = (
    <>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onEdit(sale)}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onDelete(sale)}>
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </>
  )

  if (!locked) {
    return actions
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex gap-1" />}>{actions}</TooltipTrigger>
      <TooltipContent>{t('operazioni:vendite.tableColumns.lockedTooltip')}</TooltipContent>
    </Tooltip>
  )
}

type BuildSaleTableColumnsProps = {
  onEdit: (sale: SaleWithRelations) => void
  onDelete: (sale: SaleWithRelations) => void
}

export function buildSaleTableColumns(
  { onEdit, onDelete }: BuildSaleTableColumnsProps,
  t: TFunction
): DataTableColumn<SaleWithRelations>[] {
  const statusOptions = getSaleStatusOptions(t)

  function formatParties(primaryName: string | undefined, totalCount: number | undefined) {
    if (!primaryName) return '—'

    const extra = (totalCount ?? 1) - 1
    return extra > 0 ? `${primaryName} ${t('operazioni:vendite.tableColumns.plusOthers', { count: extra })}` : primaryName
  }

  return [
    {
      header: t('operazioni:vendite.tableColumns.numero'),
      cell: (sale) => <span className="font-medium">{sale.number}</span>,
    },
    {
      header: t('operazioni:vendite.tableColumns.immobile'),
      cell: (sale) => sale.property?.code ?? '—',
    },
    {
      header: t('operazioni:vendite.tableColumns.venditore'),
      cell: (sale) => formatParties(sale.seller?.name, sale.saleSellers?.length),
    },
    {
      header: t('operazioni:vendite.tableColumns.acquirente'),
      cell: (sale) => formatParties(sale.buyer?.name, sale.saleBuyers?.length),
    },
    {
      header: t('operazioni:vendite.tableColumns.valore'),
      cell: (sale) => formatAmount(sale.finalAmount),
    },
    {
      header: t('operazioni:vendite.tableColumns.data'),
      cell: (sale) => formatDate(sale.saleDate),
    },
    {
      header: t('operazioni:vendite.tableColumns.rogito'),
      cell: (sale) => (sale.deedDate ? formatDate(sale.deedDate) : '—'),
    },
    {
      header: t('operazioni:vendite.tableColumns.agenteV'),
      cell: (sale) => sale.sellerAgent?.fullName ?? '—',
    },
    {
      header: t('operazioni:vendite.tableColumns.agenteA'),
      cell: (sale) => sale.buyerAgent?.fullName ?? '—',
    },
    {
      header: t('operazioni:vendite.tableColumns.stato'),
      cell: (sale) => <Badge variant="secondary">{getOptionLabel(statusOptions, sale.status)}</Badge>,
    },
    {
      header: t('operazioni:vendite.tableColumns.note'),
      cellClassName: 'max-w-40 truncate',
      cell: (sale) => sale.notes ?? '—',
    },
    {
      header: t('operazioni:vendite.tableColumns.azioni'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (sale) => <SaleTableActions sale={sale} onEdit={onEdit} onDelete={onDelete} t={t} />,
    },
  ]
}
