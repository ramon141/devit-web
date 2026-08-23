import { useState } from 'react'
import { Link } from 'react-router'
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
import type { PropertyWithRelations } from '@/api/generated/models'
import { statusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { useDeleteProperty } from '@/pages/Imoveis/hooks/useDeleteProperty'

type PropertyTableProps = {
  properties: PropertyWithRelations[]
  isLoading: boolean
}

function statusLabel(status?: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status ?? '—'
}

function formatPrice(value?: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function PropertyTable({ properties, isLoading }: PropertyTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PropertyWithRelations | null>(null)
  const { handleDelete } = useDeleteProperty()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Codice</TableHead>
            <TableHead>Titolo</TableHead>
            <TableHead>Città</TableHead>
            <TableHead>Proprietario</TableHead>
            <TableHead>Prezzo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && properties.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                Nessun immobile trovato.
              </TableCell>
            </TableRow>
          )}

          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.code}</TableCell>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.address?.city ?? '—'}</TableCell>
              <TableCell>{property.owner?.name ?? '—'}</TableCell>
              <TableCell>{formatPrice(property.salePrice ?? property.rentPrice)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel(property.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={<Link to={`/proprieta/${property.id}`} />}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(property)}>
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
        title="Eliminare l'immobile?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.title}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default PropertyTable
