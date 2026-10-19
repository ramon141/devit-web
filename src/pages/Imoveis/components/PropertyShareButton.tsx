import { useTranslation } from 'react-i18next'
import { Share2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { SITE_PATHS } from '@/lib/site/paths'
import type { PropertyWithRelations } from '@/api/generated/models'

type PropertyShareButtonProps = {
  property: PropertyWithRelations
  variant?: 'outline' | 'ghost'
}

function PropertyShareButton({ property, variant = 'outline' }: PropertyShareButtonProps) {
  const { t } = useTranslation('imoveis')
  const { toastPromise } = useToast()

  // Imóveis antigos sem slug ainda abrem pelo id
  const slug = property.slug ?? property.id

  function handleCopy() {
    if (!slug) return

    const url = `${window.location.origin}${SITE_PATHS.property(slug)}`

    toastPromise(navigator.clipboard.writeText(url), {
      pending: t('card.share.pending'),
      success: t('card.share.success'),
      error: t('card.share.error'),
    })
  }

  return (
    <Button variant={variant} size="icon-sm" title={t('card.share.title')} onClick={handleCopy}>
      <Share2Icon className="size-4" />
    </Button>
  )
}

export default PropertyShareButton
