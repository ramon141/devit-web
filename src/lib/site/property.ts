import type { SiteDict } from './dict'
import type { SiteBranch, SitePhoto, SiteDetail } from './types'

// A API devolve colunas decimais como string ("835000.00"): normaliza para número
export function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

export function purposeLabel(purpose: string | undefined, dict: SiteDict) {
  if (purpose === 'rent') return dict.search.rent
  if (purpose === 'rent_or_sale') return `${dict.search.sale} / ${dict.search.rent}`

  return dict.search.sale
}

// Um imóvel "rent_or_sale" aparece tanto em venda quanto em aluguel
export function matchesPurpose(purpose: string | undefined, filter: string) {
  return !filter || purpose === filter || purpose === 'rent_or_sale'
}

export function isRentOnly(purpose: string | undefined) {
  return purpose === 'rent'
}

// Fotos da ficha: capa primeiro, depois pela ordem de exibição
export function toPhotos(detail: SiteDetail): SitePhoto[] {
  const photos = [...(detail.photos ?? [])]
    .filter((photo) => !!photo.url)
    .sort((a, b) => {
      if (a.cover !== b.cover) return a.cover ? -1 : 1

      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    })
    .map((photo) => ({ url: photo.url ?? '', caption: photo.caption }))

  if (photos.length === 0 && detail.coverPhotoUrl) return [{ url: detail.coverPhotoUrl }]

  return photos
}

export function branchStreet(branch: SiteBranch) {
  const address = branch.address
  if (!address) return ''

  return [address.street, address.number].filter(Boolean).join(', ')
}

export function branchCity(branch: SiteBranch) {
  const address = branch.address
  if (!address) return ''

  return [address.postalCode, address.city].filter(Boolean).join(' ')
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`
}
