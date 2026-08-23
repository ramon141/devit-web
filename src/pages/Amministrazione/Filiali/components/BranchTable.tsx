import { useState } from 'react'
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
import type { Branch } from '@/api/generated/models'
import { useDeleteBranch } from '@/pages/Amministrazione/Filiali/hooks/useDeleteBranch'

type BranchTableProps = {
  branches: Branch[]
  isLoading: boolean
  onEdit: (branch: Branch) => void
}

function BranchTable({ branches, isLoading, onEdit }: BranchTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null)
  const { handleDelete } = useDeleteBranch()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && branches.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                Nessuna filiale trovata.
              </TableCell>
            </TableRow>
          )}

          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell>
                <Badge variant={branch.active ? 'default' : 'secondary'}>
                  {branch.active ? 'Attiva' : 'Inattiva'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(branch)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(branch)}>
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
        title="Eliminare la filiale?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default BranchTable
