import { PlusIcon } from 'lucide-react'
import {
  MODE_CONFIG,
  getAddCardStyle,
  type BannerPreviewMode,
} from '@/pages/Amministrazione/Banner/components/bannerCarouselStyles'

type BannerCarouselAddCardProps = {
  side: -1 | 1
  mode: BannerPreviewMode
  label: string
  onClick: () => void
}

function BannerCarouselAddCard({ side, mode, label, onClick }: BannerCarouselAddCardProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={getAddCardStyle()}
      className={`group absolute top-1/2 flex items-center justify-center rounded-xl bg-white shadow-lg transition-all duration-500 ease-out hover:bg-accent hover:shadow-xl ${side === -1 ? 'left-0' : 'right-0'} ${MODE_CONFIG[mode].sizeClassName}`}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
        <PlusIcon className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
      </span>
    </button>
  )
}

export default BannerCarouselAddCard
