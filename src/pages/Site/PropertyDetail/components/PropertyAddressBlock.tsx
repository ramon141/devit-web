import type { PublicPropertyControllerFindById200Address } from '@/api/generated/models'

type PropertyAddressBlockProps = {
  address: PublicPropertyControllerFindById200Address | undefined
}

function buildMapsUrl(address: PublicPropertyControllerFindById200Address): string {
  const query = [address.street, address.number, address.city].filter(Boolean).join(' ')
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`
}

function PropertyAddressBlock({ address }: PropertyAddressBlockProps) {
  if (!address) return null

  const fullStreet = [address.street, address.number].filter(Boolean).join(', ')

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-heading text-lg font-semibold">Indirizzo</h2>

      <a
        href={buildMapsUrl(address)}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-sm text-primary underline underline-offset-2"
      >
        Apri su Google Maps
      </a>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Indirizzo</dt>
        <dd>{fullStreet || '—'}</dd>

        <dt className="text-muted-foreground">Città</dt>
        <dd>{address.city}</dd>

        <dt className="text-muted-foreground">CAP</dt>
        <dd>{address.postalCode ?? '—'}</dd>
      </dl>
    </div>
  )
}

export default PropertyAddressBlock
