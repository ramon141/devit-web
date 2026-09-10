import { ImageIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { HomeBannerWithRelations } from '@/api/generated/models'
import {
  MODE_CONFIG,
  getCardStyle,
  type BannerPreviewMode,
} from '@/pages/Amministrazione/Banner/components/bannerCarouselStyles'

type BannerCarouselCardProps = {
  banner: HomeBannerWithRelations
  distance: number
  mode: BannerPreviewMode
  inactiveLabel: string
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

function BannerCarouselCard({
  banner,
  distance,
  mode,
  inactiveLabel,
  onSelect,
  onEdit,
  onDelete,
}: BannerCarouselCardProps) {
  const isCurrent = distance === 0
  const attachment = mode === 'mobile' ? banner.mobileAttachment : banner.attachment
  const bannerId = banner.id ?? ''

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform: dragTransform,
    isDragging,
  } = useDraggable({ id: bannerId })
  const baseStyle = getCardStyle(distance, mode)
  const dragOffset = CSS.Translate.toString(dragTransform)

  // Durante o arrasto o card segue o cursor e a transição é desligada
  const style = {
    ...baseStyle,
    transform: dragOffset ? `${dragOffset} ${baseStyle.transform}` : baseStyle.transform,
    zIndex: isDragging ? 50 : baseStyle.zIndex,
    opacity: isDragging ? 0.85 : baseStyle.opacity,
  }

  return (
    <div
      ref={setDragRef}
      style={style}
      onClick={isCurrent ? undefined : onSelect}
      {...listeners}
      {...attributes}
      className={`absolute left-1/2 touch-none overflow-hidden rounded-xl shadow-xl ${MODE_CONFIG[mode].sizeClassName} ${
        isDragging
          ? 'cursor-grabbing shadow-2xl transition-none'
          : 'cursor-grab transition-all duration-500 ease-out hover:shadow-2xl'
      }`}
    >
      {attachment?.url ? (
        <img
          src={attachment.url}
          alt={banner.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
      )}

      {!banner.active ? (
        <Badge variant="secondary" className="absolute left-3 top-3">
          {inactiveLabel}
        </Badge>
      ) : null}

      {isCurrent ? (
        <div className="absolute right-3 top-3 flex gap-1">
          <Button variant="secondary" size="icon-sm" onClick={onEdit}>
            <PencilIcon className="size-4" />
          </Button>

          <Button variant="secondary" size="icon-sm" onClick={onDelete}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <p className="font-semibold text-white">{banner.title}</p>

        {banner.subtitle ? <p className="text-xs text-white/80">{banner.subtitle}</p> : null}
      </div>
    </div>
  )
}

export default BannerCarouselCard
