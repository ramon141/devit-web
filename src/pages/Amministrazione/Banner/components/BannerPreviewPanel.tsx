import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIcon, MonitorIcon, SmartphoneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useObjectUrl } from '@/hooks/useObjectUrl'

type BannerPreviewPanelProps = {
  title: string
  subtitle?: string
  desktopFile?: File
  mobileFile?: File
  desktopUrl?: string | null
  mobileUrl?: string | null
}

const FRAME_CLASSNAME = {
  desktop: 'aspect-video w-full',
  mobile: 'aspect-[9/16] w-56',
} as const

function BannerPreviewPanel({
  title,
  subtitle,
  desktopFile,
  mobileFile,
  desktopUrl,
  mobileUrl,
}: BannerPreviewPanelProps) {
  const { t } = useTranslation('amministrazione')
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')

  const desktopPreview = useObjectUrl(desktopFile) ?? desktopUrl
  const mobilePreview = useObjectUrl(mobileFile) ?? mobileUrl
  const src = mode === 'desktop' ? desktopPreview : mobilePreview

  return (
    <div className="grid gap-4">
      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant={mode === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('desktop')}
        >
          <MonitorIcon className="size-4" />
          {t('bannerCarousel.desktop')}
        </Button>

        <Button
          type="button"
          variant={mode === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('mobile')}
        >
          <SmartphoneIcon className="size-4" />
          {t('bannerCarousel.mobile')}
        </Button>
      </div>

      <div className="flex justify-center">
        <div
          className={`relative overflow-hidden rounded-xl border shadow-sm transition-all duration-500 ease-out ${FRAME_CLASSNAME[mode]}`}
        >
          {src ? (
            <img
              key={src}
              src={src}
              alt={title}
              className="h-full w-full animate-in object-cover fade-in duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageIcon className="size-8 text-muted-foreground" />
            </div>
          )}

          {title || subtitle ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="font-semibold text-white">{title}</p>

              {subtitle ? <p className="text-xs text-white/80">{subtitle}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BannerPreviewPanel
