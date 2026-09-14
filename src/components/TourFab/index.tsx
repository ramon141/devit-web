import { HelpCircle, PlayCircle, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TourFabProps = {
  onClick: () => void
  videoUrl?: string
}

function TourFab({ onClick, videoUrl }: TourFabProps) {
  const { t } = useTranslation('common')

  // Sem vídeo tutorial não há escolha a fazer: o clique já inicia o tour
  // direto, sem menu intermediário
  if (!videoUrl) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <Button size="icon-lg" className="rounded-full shadow-lg" onClick={onClick}>
          <HelpCircle />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
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
