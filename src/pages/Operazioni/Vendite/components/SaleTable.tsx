import { useState } from 'react'
import dayjs from 'dayjs'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { SaleWithRelations } from '@/api/generated/models'
import { saleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import { useDeleteSale } from '@/pages/Operazioni/Vendite/hooks/useDeleteSale'

type SaleTableProps = {
  sales: SaleWithRelations[]
  isLoading: boolean
  onEdit: (sale: SaleWithRelations) => void
}

function statusLabel(status?: string) {
  return saleStatusOptions.find((option) => option.value === status)?.label ?? status ?? '—'
}

function isLocked(status?: string) {
  return status === 'sold' || status === 'canceled'
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function SaleTable({ sales, isLoading, onEdit }: SaleTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<SaleWithRelations | null>(null)
  const { handleDelete } = useDeleteSale()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numero</TableHead>
            <TableHead>Immobile</TableHead>
            <TableHead>Venditore</TableHead>
            <TableHead>Acquirente</TableHead>
            <TableHead>Valore</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                Nessuna vendita trovata.
              </TableCell>
            </TableRow>
          )}

          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.number}</TableCell>
              <TableCell>{sale.property?.code ?? '—'}</TableCell>
              <TableCell>{sale.seller?.name ?? '—'}</TableCell>
              <TableCell>{sale.buyer?.name ?? '—'}</TableCell>
              <TableCell>{formatAmount(sale.finalAmount)}</TableCell>
              <TableCell>{dayjs(sale.saleDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel(sale.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(sale.status)}
                  onClick={() => onEdit(sale)}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(sale.status)}
                  onClick={() => setDeleteTarget(sale)}
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminare la vendita?"
        description={`Questa azione eliminerà definitivamente la vendita "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default SaleTable
