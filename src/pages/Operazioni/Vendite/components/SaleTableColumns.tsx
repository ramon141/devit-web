import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { SaleWithRelations } from '@/api/generated/models'
import { saleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
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
}

function SaleTableActions({ sale, onEdit, onDelete }: SaleTableActionsProps) {
  const locked = isLocked(sale.status)

  return (
    <>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onEdit(sale)}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={locked} onClick={() => onDelete(sale)}>
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </>
  )
}

type BuildSaleTableColumnsProps = {
  onEdit: (sale: SaleWithRelations) => void
  onDelete: (sale: SaleWithRelations) => void
}

export function buildSaleTableColumns({
  onEdit,
  onDelete,
}: BuildSaleTableColumnsProps): DataTableColumn<SaleWithRelations>[] {
  return [
    { header: 'Numero', cell: (sale) => <span className="font-medium">{sale.number}</span> },
    { header: 'Immobile', cell: (sale) => sale.property?.code ?? '—' },
    { header: 'Venditore', cell: (sale) => sale.seller?.name ?? '—' },
    { header: 'Acquirente', cell: (sale) => sale.buyer?.name ?? '—' },
    { header: 'Valore', cell: (sale) => formatAmount(sale.finalAmount) },
    { header: 'Data', cell: (sale) => formatDate(sale.saleDate) },
    {
      header: 'Stato',
      cell: (sale) => (
        <Badge variant="secondary">{getOptionLabel(saleStatusOptions, sale.status)}</Badge>
      ),
    },
    {
      header: 'Azioni',
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (sale) => <SaleTableActions sale={sale} onEdit={onEdit} onDelete={onDelete} />,
    },
  ]
}
