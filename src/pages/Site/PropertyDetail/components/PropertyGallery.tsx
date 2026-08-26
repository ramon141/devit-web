import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { PublicPropertyControllerFindById200PhotosItem } from '@/api/generated/models'

type PropertyGalleryProps = {
  photos: PublicPropertyControllerFindById200PhotosItem[] | undefined
}

function sortPhotos(
  photos: PublicPropertyControllerFindById200PhotosItem[],
): PublicPropertyControllerFindById200PhotosItem[] {
  return [...photos].sort((a, b) => {
    if (a.cover !== b.cover) return a.cover ? -1 : 1
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  })
}

function PropertyGallery({ photos }: PropertyGalleryProps) {
  const { t } = useTranslation('site')

  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        {t('propertyGallery.noPhoto')}
      </div>
    )
  }

  const sorted = sortPhotos(photos)
  const cover = sorted[0]
  const rest = sorted.slice(1)

  if (!cover) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <a
        href={cover.url}
        target="_blank"
        rel="noreferrer"
        className={cn('col-span-2 row-span-2 block aspect-video overflow-hidden rounded-xl', 'sm:col-span-2')}
      >
        <img
          src={cover.url}
          alt={cover.caption ?? t('propertyGallery.photoAlt')}
          className="h-full w-full object-cover"
        />
      </a>

      {rest.slice(0, 6).map((photo, index) => (
        <a
          key={photo.url ?? index}
          href={photo.url}
          target="_blank"
          rel="noreferrer"
          className="block aspect-square overflow-hidden rounded-xl"
        >
          <img
            src={photo.url}
            alt={photo.caption ?? t('propertyGallery.photoAlt')}
            className="h-full w-full object-cover"
          />
        </a>
      ))}
    </div>
  )
}

export default PropertyGallery
