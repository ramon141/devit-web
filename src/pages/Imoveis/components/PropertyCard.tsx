import { useState } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import { BedDoubleIcon, CopyIcon, ImageIcon, PencilIcon, RulerIcon, ShowerHeadIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { Attachment, PropertyPhoto, PropertyWithRelations } from '@/api/generated/models'
import { statusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { useDeleteProperty } from '@/pages/Imoveis/hooks/useDeleteProperty'
import { useDuplicateProperty } from '@/pages/Imoveis/hooks/useDuplicateProperty'

type PropertyCardProps = {
  property: PropertyWithRelations
}

function statusLabel(status?: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status ?? '—'
}

function formatPrice(value?: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function coverUrl(photos?: (PropertyPhoto & { attachment?: Attachment })[]) {
  const cover = photos?.find((photo) => photo.cover) ?? photos?.[0]
  return cover?.attachment?.url ?? null
}

function isNew(createdAt?: string) {
  return !!createdAt && dayjs().diff(dayjs(createdAt), 'day') <= 7
}

function PropertyCard({ property }: PropertyCardProps) {
  const [deleteTarget, setDeleteTarget] = useState<PropertyWithRelations | null>(null)
  const { handleDelete } = useDeleteProperty()
  const { handleDuplicate } = useDuplicateProperty()
  const photo = coverUrl(property.propertyPhotos)

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <div className="relative flex h-40 items-center justify-center bg-muted">
        {photo ? (
          <img src={photo} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="size-10 text-muted-foreground" />
        )}
        {isNew(property.createdAt) && <Badge className="absolute top-2 left-2">Nuovo</Badge>}
      </div>

      <div className="grid gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{property.code}</p>
          <Badge variant="secondary">{statusLabel(property.status)}</Badge>
        </div>

        <p className="line-clamp-1 font-medium">{property.title}</p>
        <p className="text-sm text-muted-foreground">
          {property.category?.name ?? '—'} · {property.address?.city ?? '—'}
        </p>

        {property.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{property.description}</p>
        )}

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDoubleIcon className="size-4" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <ShowerHeadIcon className="size-4" /> {property.bathrooms}
            </span>
          )}
          {property.areaSqm != null && (
            <span className="flex items-center gap-1">
              <RulerIcon className="size-4" /> {property.areaSqm}m²
            </span>
          )}
        </div>

        <p className="font-semibold">{formatPrice(property.salePrice ?? property.rentPrice)}</p>
        <p className="text-xs text-muted-foreground">
          Modificato il {dayjs(property.updatedAt ?? property.createdAt).format('DD/MM/YYYY')}
        </p>

        <div className="flex justify-end gap-1 pt-1">
          <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link to={`/proprieta/${property.id}`} />}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => handleDuplicate(property)}>
            <CopyIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(property)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </div>
      </div>

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

export default PropertyCard
