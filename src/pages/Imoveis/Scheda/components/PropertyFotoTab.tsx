import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StarIcon, Trash2Icon } from 'lucide-react'
import type { PropertyPhotoWithRelations } from '@/api/generated/models'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { usePropertyPhotos } from '@/pages/Imoveis/Scheda/hooks/usePropertyPhotos'

type PhotoCardProps = {
  photo: PropertyPhotoWithRelations
  onSetCover: (id: string) => void
  onRemove: (id: string) => void
}

function PhotoCard({ photo, onSetCover, onRemove }: PhotoCardProps) {
  const { t } = useTranslation('imoveis')

  return (
    <div className="relative overflow-hidden rounded-lg ring-1 ring-border">
      {photo.attachment?.url ? (
        <img src={photo.attachment.url} alt={photo.caption ?? ''} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-muted" />
      )}

      <div className="flex items-center justify-between gap-2 p-2">
        <span className="truncate text-xs text-muted-foreground">
          {photo.attachment?.originalName ?? photo.attachmentId}
        </span>

        <div className="flex shrink-0 gap-1">
          <Button
            variant={photo.cover ? 'default' : 'ghost'}
            size="icon-sm"
            title={t('scheda.fotoTab.setCover')}
            onClick={() => photo.id && onSetCover(photo.id)}
          >
            <StarIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title={t('scheda.fotoTab.remove')}
            onClick={() => photo.id && onRemove(photo.id)}
          >
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}

type PropertyFotoTabProps = {
  propertyId: string
}

function PropertyFotoTab({ propertyId }: PropertyFotoTabProps) {
  const { t } = useTranslation('imoveis')
  const { photos, uploadFiles, removePhoto, setCover } = usePropertyPhotos(propertyId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    setPendingFiles(files)
    if (files.length > 0) {
      uploadFiles(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <FileUpload
        label={t('scheda.fotoTab.uploadLabel')}
        value={pendingFiles}
        onChange={handleChange}
        accept="image/*"
        multiple
      />

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('scheda.fotoTab.empty')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onSetCover={setCover} onRemove={removePhoto} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyFotoTab
