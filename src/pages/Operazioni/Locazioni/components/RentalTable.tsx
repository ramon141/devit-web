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
import type { RentalContractWithRelations } from '@/api/generated/models'
import { rentalSituationOptions } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'
import { useDeleteRentalContract } from '@/pages/Operazioni/Locazioni/hooks/useDeleteRentalContract'

type RentalTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
  onEdit: (contract: RentalContractWithRelations) => void
}

function situationLabel(situation?: string) {
  return rentalSituationOptions.find((option) => option.value === situation)?.label ?? situation ?? '—'
}

function isLocked(situation?: string) {
  return situation === 'terminated' || situation === 'closed'
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function RentalTable({ contracts, isLoading, onEdit }: RentalTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<RentalContractWithRelations | null>(null)
  const { handleDelete } = useDeleteRentalContract()

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
            <TableHead>Proprietario</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Affitto</TableHead>
            <TableHead>Inizio</TableHead>
            <TableHead>Situazione</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                Nessun contratto trovato.
              </TableCell>
            </TableRow>
          )}

          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.number}</TableCell>
              <TableCell>{contract.property?.code ?? '—'}</TableCell>
              <TableCell>{contract.owner?.name ?? '—'}</TableCell>
              <TableCell>{contract.tenant?.name ?? '—'}</TableCell>
              <TableCell>{formatAmount(contract.rentAmount)}</TableCell>
              <TableCell>{dayjs(contract.startDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Badge variant="secondary">{situationLabel(contract.situation)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(contract.situation)}
                  onClick={() => onEdit(contract)}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLocked(contract.situation)}
                  onClick={() => setDeleteTarget(contract)}
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
        title="Eliminare il contratto?"
        description={`Questa azione eliminerà definitivamente il contratto "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default RentalTable
