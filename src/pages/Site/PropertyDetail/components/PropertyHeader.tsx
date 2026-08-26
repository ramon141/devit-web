import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Heart, Share2, Printer } from 'lucide-react'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { formatCurrency } from '@/pages/Site/PropertyDetail/utils/formatters'
import { useFavorite } from '@/pages/Site/hooks/useFavorite'
import { useToast } from '@/contexts/ToastContext'
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

function shareProperty(title: string, toastPromise: ReturnType<typeof useToast>['toastPromise']) {
  const shareUrl = window.location.href

  if (navigator.share) {
    navigator.share({ title, url: shareUrl }).catch(() => undefined)
    return
  }

  toastPromise(navigator.clipboard.writeText(shareUrl), {
    pending: 'Copio il link...',
    success: 'Link copiato negli appunti!',
    error: 'Impossibile copiare il link.',
  })
}

function PropertyHeader({ property }: PropertyHeaderProps) {
  const isRent = property.purpose === 'rent'
  const price = formatCurrency(property.price)
  const { isFavorite, toggle } = useFavorite(property.id ?? '')
  const { toastPromise } = useToast()

  return (
    <div className="flex flex-col gap-3">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        {property.category?.name && <span>{property.category.name}</span>}
        <span>/</span>
        <span className="truncate">{property.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <DropCapHeading as="h1" text={property.title ?? ''} className="text-2xl font-bold sm:text-3xl" />

        <div className="flex items-center gap-2">
          <ActionIcon
            label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            icon={<Heart className={cn('size-4', isFavorite && 'fill-red-500')} />}
            active={isFavorite}
            onClick={toggle}
          />
          <ActionIcon
            label="Condividi"
            icon={<Share2 className="size-4" />}
            onClick={() => shareProperty(property.title ?? 'Immobile', toastPromise)}
          />
          <ActionIcon label="Stampa" icon={<Printer className="size-4" />} onClick={() => window.print()} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.featured && (
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              Esclusiva
            </span>
          )}

          <span className="rounded bg-[var(--devit-navy-dark)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {isRent ? 'Affitto' : 'Vendita'}
          </span>

          {property.code && (
            <span className="text-xs text-muted-foreground">Rif. {property.code}</span>
          )}
        </div>

        {price && <p className="text-2xl font-bold text-foreground">{price}</p>}
      </div>

      <p className="text-sm text-muted-foreground">{buildShortAddress(property)}</p>
    </div>
  )
}

export default PropertyHeader
