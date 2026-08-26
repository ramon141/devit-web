import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicPropertyControllerFindById200Address } from '@/api/generated/models'

type PropertyAddressBlockProps = {
  address: PublicPropertyControllerFindById200Address | undefined
}

function buildMapsUrl(address: PublicPropertyControllerFindById200Address): string {
  const query = [address.street, address.number, address.city].filter(Boolean).join(' ')
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`
}

function PropertyAddressBlock({ address }: PropertyAddressBlockProps) {
  const { t } = useTranslation('site')

  if (!address) return null

  const fullStreet = [address.street, address.number].filter(Boolean).join(', ')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold">{t('propertyAddressBlock.title')}</h2>

        <a
          href={buildMapsUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <MapPin className="size-4" />
          {t('propertyAddressBlock.openMaps')}
        </a>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">{t('propertyAddressBlock.address')}</dt>
        <dd>{fullStreet || t('propertyAddressBlock.empty')}</dd>

        <dt className="text-muted-foreground">{t('propertyAddressBlock.city')}</dt>
        <dd>{address.city}</dd>

        <dt className="text-muted-foreground">{t('propertyAddressBlock.postalCode')}</dt>
        <dd>{address.postalCode ?? t('propertyAddressBlock.empty')}</dd>
      </dl>
    </div>
  )
}

export default PropertyAddressBlock
