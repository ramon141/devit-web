import { useTranslation } from 'react-i18next'
import { RotateCcwIcon, UploadIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import FileUpload from '@/components/FileUpload'
import { useObjectUrl } from '@/hooks/useObjectUrl'
import { useHomeVideo } from '@/pages/Amministrazione/VideoHome/hooks/useHomeVideo'
import {
  HOME_VIDEO_MAX_MB,
  HOME_VIDEO_MAX_SECONDS,
  useVideoSelection,
} from '@/pages/Amministrazione/VideoHome/hooks/useVideoSelection'
import VideoPlayer from '@/pages/Amministrazione/VideoHome/components/VideoPlayer'

const DEFAULT_VIDEO_URL = '/video/hero-loop-1080.mp4'
const DEFAULT_POSTER_URL = '/video/hero-poster.jpg'

function VideoHome() {
  const { t } = useTranslation('amministrazione')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { video, isLoading, isBusy, publish, reset } = useHomeVideo()
  const selection = useVideoSelection()
  const previewUrl = useObjectUrl(selection.file)

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="grid gap-4 rounded-xl border bg-white p-6">
        <h2 className="font-semibold">
          {video ? t('videoHome.currentCustom') : t('videoHome.currentDefault')}
        </h2>

        {isLoading ? null : (
          <VideoPlayer src={video?.url ?? DEFAULT_VIDEO_URL} poster={DEFAULT_POSTER_URL} />
        )}

        {video ? (
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => setConfirmOpen(true)}
          >
            <RotateCcwIcon className="size-4" />
            {t('videoHome.resetButton')}
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 rounded-xl border bg-white p-6">
        <h2 className="font-semibold">{t('videoHome.newVideo')}</h2>

        <FileUpload
          value={selection.file ? [selection.file] : []}
          onChange={selection.select}
          accept="video/mp4"
          maxSizeMb={HOME_VIDEO_MAX_MB}
          error={selection.error}
          hint={t('videoHome.hint', { mb: HOME_VIDEO_MAX_MB, seconds: HOME_VIDEO_MAX_SECONDS })}
        />

        {previewUrl ? (
          <>
            <p className="text-sm text-muted-foreground">{t('videoHome.previewNote')}</p>
            <VideoPlayer src={previewUrl} />
          </>
        ) : null}

        <Button
          type="button"
          disabled={!selection.file || isBusy}
          onClick={() => selection.file && publish(selection.file, selection.clear)}
        >
          <UploadIcon className="size-4" />
          {t('videoHome.publishButton')}
        </Button>
      </div>

      <ConfirmPopup
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('videoHome.resetTitle')}
        description={t('videoHome.resetDescription')}
        confirmLabel={t('videoHome.resetConfirm')}
        onConfirm={() => {
          reset()
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}

export default VideoHome
