import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Heart, Share2, Printer } from 'lucide-react'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { formatCurrency } from '@/pages/Site/PropertyDetail/utils/formatters'
import { useFavorite } from '@/pages/Site/hooks/useFavorite'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { cn } from '@/lib/utils'
import type { PublicPropertyControllerFindById200 } from '@/api/generated/models'

type PropertyHeaderProps = {
  property: PublicPropertyControllerFindById200
}

function buildShortAddress(property: PublicPropertyControllerFindById200): string {
  const address = property.address
  if (!address) return ''

  const parts = [address.street, address.city].filter(Boolean)
  return parts.join(', ')
}

type ActionIconProps = {
  label: string
  icon: ReactNode
  active?: boolean
  onClick: () => void
}

function ActionIcon({ label, icon, active, onClick }: ActionIconProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary',
        active && 'border-red-500 text-red-500'
      )}
    >
      {icon}
    </button>
  )
}

function shareProperty(
  t: TFunction<'site'>,
  title: string,
  promisePopup: ReturnType<typeof usePromisePopup>['promisePopup'],
) {
  const shareUrl = window.location.href

  if (navigator.share) {
    navigator.share({ title, url: shareUrl }).catch(() => undefined)
    return
  }

  promisePopup(navigator.clipboard.writeText(shareUrl), {
    pending: t('propertyHeader.sharePending'),
    success: t('propertyHeader.shareSuccess'),
    error: t('propertyHeader.shareError'),
  })
}

function PropertyHeader({ property }: PropertyHeaderProps) {
  const { t } = useTranslation('site')
  const isRent = property.purpose === 'rent'
  const price = formatCurrency(property.price)
  const { isFavorite, toggle } = useFavorite(property.id ?? '')
  const { promisePopup } = usePromisePopup()

  return (
    <div className="flex flex-col gap-3">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">{t('propertyHeader.home')}</Link>
        <span>/</span>
        {property.category?.name && <span>{property.category.name}</span>}
        <span>/</span>
        <span className="truncate">{property.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <DropCapHeading as="h1" text={property.title ?? ''} className="text-2xl font-bold sm:text-3xl" />

        <div className="flex items-center gap-2">
          <ActionIcon
            label={
              isFavorite
                ? t('propertyHeader.removeFavorite')
                : t('propertyHeader.addFavorite')
            }
            icon={<Heart className={cn('size-4', isFavorite && 'fill-red-500')} />}
            active={isFavorite}
            onClick={toggle}
          />
          <ActionIcon
            label={t('propertyHeader.share')}
            icon={<Share2 className="size-4" />}
            onClick={() => shareProperty(t, property.title ?? t('propertyHeader.defaultTitle'), promisePopup)}
          />
          <ActionIcon
            label={t('propertyHeader.print')}
            icon={<Printer className="size-4" />}
            onClick={() => window.print()}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.featured && (
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              {t('propertyHeader.exclusive')}
            </span>
          )}

          <span className="rounded bg-[var(--devit-navy-dark)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {isRent ? t('propertyHeader.statusRent') : t('propertyHeader.statusSale')}
          </span>

          {property.code && (
            <span className="text-xs text-muted-foreground">
              {t('propertyHeader.code', { code: property.code })}
            </span>
          )}
        </div>

        {price && <p className="text-2xl font-bold text-foreground">{price}</p>}
      </div>

      <p className="text-sm text-muted-foreground">{buildShortAddress(property)}</p>
    </div>
  )
}

export default PropertyHeader
