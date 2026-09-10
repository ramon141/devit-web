import { useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { MODE_CONFIG } from '@/pages/Amministrazione/Banner/components/bannerCarouselStyles'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon, MonitorIcon, SmartphoneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { HomeBannerWithRelations } from '@/api/generated/models'
import { useDeleteBanner } from '@/pages/Amministrazione/Banner/hooks/useDeleteBanner'
import { useReorderBanners } from '@/pages/Amministrazione/Banner/hooks/useReorderBanners'
import BannerCarouselCard from '@/pages/Amministrazione/Banner/components/BannerCarouselCard'
import BannerCarouselAddCard from '@/pages/Amministrazione/Banner/components/BannerCarouselAddCard'
import type { BannerPreviewMode } from '@/pages/Amministrazione/Banner/components/bannerCarouselStyles'

type BannerCarouselProps = {
  banners: HomeBannerWithRelations[]
  isLoading: boolean
  onEdit: (banner: HomeBannerWithRelations) => void
  onCreate: () => void
}

function BannerCarousel({ banners, isLoading, onEdit, onCreate }: BannerCarouselProps) {
  const { t } = useTranslation('amministrazione')
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<BannerPreviewMode>('desktop')
  const [deleteTarget, setDeleteTarget] = useState<HomeBannerWithRelations | null>(null)
  const { handleDelete } = useDeleteBanner()
  const { reorder } = useReorderBanners({ banners })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // O carrossel é horizontal: a distância arrastada decide quantas posições o banner anda
  function handleDragEnd(event: DragEndEvent) {
    const fromIndex = banners.findIndex((banner) => banner.id === String(event.active.id))
    const steps = Math.round(event.delta.x / MODE_CONFIG[mode].offsetX)

    if (fromIndex < 0 || !steps) return

    const toIndex = Math.min(Math.max(fromIndex + steps, 0), banners.length - 1)

    // A posição central não muda: quem passa a ocupá-la é o banner que entrou no lugar
    reorder(fromIndex, toIndex)
  }

  const current = Math.min(active, Math.max(banners.length - 1, 0))

  function move(step: number) {
    setActive((previous) => (previous + step + banners.length) % banners.length)
  }

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (isLoading || !banners.length) {
    return (
      <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
        {isLoading ? t('bannerCarousel.loading') : t('bannerTable.empty')}
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-center gap-2">
        <Button
          variant={mode === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('desktop')}
        >
          <MonitorIcon className="size-4" />
          {t('bannerCarousel.desktop')}
        </Button>

        <Button
          variant={mode === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('mobile')}
        >
          <SmartphoneIcon className="size-4" />
          {t('bannerCarousel.mobile')}
        </Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative flex h-80 items-center justify-center overflow-hidden">
          <BannerCarouselAddCard
            side={-1}
            mode={mode}
            label={t('banner.newLabel')}
            onClick={onCreate}
          />

          <BannerCarouselAddCard
            side={1}
            mode={mode}
            label={t('banner.newLabel')}
            onClick={onCreate}
          />

          {banners.map((banner, index) => (
            <BannerCarouselCard
              key={banner.id}
              banner={banner}
              distance={index - current}
              mode={mode}
              inactiveLabel={t('bannerTableColumns.inactive')}
              onSelect={() => setActive(index)}
              onEdit={() => onEdit(banner)}
              onDelete={() => setDeleteTarget(banner)}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => move(-1)} className="rounded-full">
          <ChevronLeftIcon className="size-4" />
        </Button>

        <div className="flex gap-1.5">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={banner.title}
              onClick={() => setActive(index)}
              className={`size-2 rounded-full transition-colors ${
                index === current ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button variant="ghost" size="icon-sm" onClick={() => move(1)} className="rounded-full">
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('bannerTable.deleteTitle')}
        description={t('bannerTable.deleteDescription', { title: deleteTarget?.title })}
        variant="destructive"
        confirmLabel={t('bannerTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default BannerCarousel
