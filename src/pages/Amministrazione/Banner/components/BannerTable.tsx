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
import type { HomeBanner } from '@/api/generated/models'
import { useDeleteBanner } from '@/pages/Amministrazione/Banner/hooks/useDeleteBanner'

type BannerTableProps = {
  banners: HomeBanner[]
  isLoading: boolean
  onEdit: (banner: HomeBanner) => void
}

function BannerTable({ banners, isLoading, onEdit }: BannerTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<HomeBanner | null>(null)
  const { handleDelete } = useDeleteBanner()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titolo</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Ordine</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && banners.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Nessun banner trovato.
              </TableCell>
            </TableRow>
          )}

          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell className="font-medium">{banner.title}</TableCell>
              <TableCell className="max-w-48 truncate">{banner.targetLink ?? '—'}</TableCell>
              <TableCell>{banner.displayOrder ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={banner.active ? 'default' : 'secondary'}>
                  {banner.active ? 'Attivo' : 'Inattivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(banner)}>
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
        title="Eliminare il banner?"
        description={`Questa azione eliminerà definitivamente "${deleteTarget?.title}".`}
        variant="destructive"
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default BannerTable
