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
import type { PropertyCategory } from '@/api/generated/models'
import { useDeleteCategory } from '@/pages/Amministrazione/Categorie/hooks/useDeleteCategory'

type CategoryTableProps = {
  categories: PropertyCategory[]
  isLoading: boolean
  onEdit: (category: PropertyCategory) => void
}

function CategoryTable({ categories, isLoading, onEdit }: CategoryTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PropertyCategory | null>(null)
  const { handleDelete } = useDeleteCategory()

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
            <TableHead>Slug</TableHead>
            <TableHead>Ordine</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Nessuna categoria trovata.
              </TableCell>
            </TableRow>
          )}

          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.displayOrder ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={category.active ? 'default' : 'secondary'}>
                  {category.active ? 'Attiva' : 'Inattiva'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(category)}>
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
        title="Eliminare la categoria?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.name}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default CategoryTable
