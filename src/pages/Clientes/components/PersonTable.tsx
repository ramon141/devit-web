import { useState } from 'react'
import { Link } from 'react-router'
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react'
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
import type { PersonWithRelations } from '@/api/generated/models'
import { personRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import { useDeletePerson } from '@/pages/Clientes/hooks/useDeletePerson'

type PersonTableProps = {
  people: PersonWithRelations[]
  isLoading: boolean
  onEdit: (person: PersonWithRelations) => void
}

function roleLabel(role: string) {
  return personRoleOptions.find((option) => option.value === role)?.label ?? role
}

function PersonTable({ people, isLoading, onEdit }: PersonTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PersonWithRelations | null>(null)
  const { handleDelete } = useDeletePerson()

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
            <TableHead>Ruolo</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && people.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Nessun cliente trovato.
              </TableCell>
            </TableRow>
          )}

          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-medium">{person.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{roleLabel(person.role)}</Badge>
              </TableCell>
              <TableCell>{person.email ?? '—'}</TableCell>
              <TableCell>{person.phone ?? '—'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={<Link to={`/clienti/${person.id}`} />}
                >
                  <EyeIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(person)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteTarget(person)}
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
        title="Eliminare il cliente?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default PersonTable
