import { HelpCircle, PlayCircle, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TourFabProps = {
  onClick: () => void
  videoUrl?: string
  className?: string
}

function TourFab({ onClick, videoUrl, className }: TourFabProps) {
  const { t } = useTranslation('common')

  // Sem vídeo tutorial não há escolha a fazer: o clique já inicia o tour
  // direto, sem menu intermediário
  if (!videoUrl) {
    return (
      <div className={cn('fixed right-6 bottom-6 z-50', className)}>
        <Button size="icon-lg" className="rounded-full shadow-lg" onClick={onClick}>
          <HelpCircle />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('fixed right-6 bottom-6 z-50', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon-lg" className="rounded-full shadow-lg">
              <HelpCircle />
            </Button>
          }
        />

        <DropdownMenuContent align="end" side="top">
          <DropdownMenuItem onClick={onClick}>
            <PlayCircle />
            {t('tour.fab.start')}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.open(videoUrl, '_blank')}>
            <Video />
            {t('tour.fab.video')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TourFab
