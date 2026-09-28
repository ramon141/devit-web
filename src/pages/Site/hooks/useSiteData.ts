import { useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import {
  usePublicBranchControllerFind,
  usePublicPropertyControllerFacets,
  usePublicPropertyControllerFind,
  usePublicPropertyControllerFindById,
  usePublicPropertyControllerFindFeatured,
  usePublicPropertyMapControllerFind,
  usePublicZoneControllerFind,
} from '@/api/generated/api'
import type { PublicPropertyControllerFindParams } from '@/api/generated/models'
import { formatPrice, useSiteDict } from '@/lib/site/dict'
import { toNumber } from '@/lib/site/property'
import { SITE_PATHS } from '@/lib/site/paths'
import type { SiteCard, SiteDetail } from '@/lib/site/types'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'

// Toda leitura do site público passa por aqui (endpoints /public/*, sem login)

export function usePropertyList(params: PublicPropertyControllerFindParams) {
  return usePublicPropertyControllerFind(params, { query: { placeholderData: keepPreviousData } })
}

export function useFeaturedProperties(limit: number) {
  return usePublicPropertyControllerFindFeatured({ limit })
}

export function useProperty(id: string) {
  return usePublicPropertyControllerFindById(id, { query: { retry: false } })
}

export function useZones() {
  return usePublicZoneControllerFind()
}

export function useBranches() {
  return usePublicBranchControllerFind()
}

export function useCategoryFacets() {
  return usePublicPropertyControllerFacets()
}

// Imóveis parecidos: mesma zona (ou cidade) e mesmo tipo de contrato, sem o próprio imóvel
export function useRelatedProperties(detail: SiteDetail | undefined) {
  const zone = detail?.zone?.slug
  const purpose = detail?.purpose === 'rent' ? 'rent' : 'sale'

  const { data, isSuccess } = usePublicPropertyControllerFind(
    { purpose, zone, city: zone ? undefined : detail?.address?.city, limit: 4 },
    { query: { enabled: !!detail } }
  )

  const items = useMemo<SiteCard[]>(
    () => (data?.items ?? []).filter((item) => item.id !== detail?.id).slice(0, 3),
    [data, detail?.id]
  )

  return { items, isSuccess }
}

// Só o necessário para os pontos do mapa (a API já devolve só o que tem coordenada pública)
export function useMapPins() {
  const { dict, locale } = useSiteDict()
  const { data, isSuccess } = usePublicPropertyMapControllerFind()

  const pins = useMemo<MapPin[]>(
    () =>
      (data ?? []).map((pin) => {
        const isRent = pin.purpose === 'rent' && toNumber(pin.price) !== null

        return {
          id: pin.id ?? '',
          href: SITE_PATHS.property(pin.id ?? ''),
          title: pin.title ?? '',
          price: formatPrice(pin.price, locale, dict) + (isRent ? dict.property.perMonth : ''),
          zone: pin.zone?.slug ?? '',
          zoneLabel: pin.zone?.name ?? '',
          purpose: pin.purpose ?? 'sale',
          lat: toNumber(pin.latitude) ?? 0,
          lng: toNumber(pin.longitude) ?? 0,
          cover: pin.coverPhotoUrl ?? undefined,
        }
      }),
    [data, dict, locale]
  )

  return { pins, isSuccess }
}
