import { Link, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { usePublicPropertyControllerFind } from '@/api/generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import PropertyCard from '@/pages/Site/components/PropertyCard'
import PropertySort from '@/pages/Site/components/PropertySort'
import Pagination from '@/pages/Site/components/Pagination'

const DEFAULT_LIMIT = 20

type ListingsProps = {
  fixedPurpose?: 'sale' | 'rent'
}

function pageTitle(t: TFunction<'site'>, fixedPurpose?: 'sale' | 'rent') {
  if (fixedPurpose === 'sale') return t('listings.titleSale')
  if (fixedPurpose === 'rent') return t('listings.titleRent')
  return t('listings.titleSearch')
}

function numberParam(params: URLSearchParams, key: string) {
  const value = params.get(key)
  return value ? Number(value) : undefined
}

function Listings({ fixedPurpose }: ListingsProps) {
  const { t } = useTranslation('site')
  const [searchParams, setSearchParams] = useSearchParams()

  const page = numberParam(searchParams, 'page') ?? 1
  const sort = searchParams.get('sort') ?? 'featured'

  const { data, isLoading } = usePublicPropertyControllerFind({
    purpose: fixedPurpose ?? searchParams.get('purpose') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    keyword: searchParams.get('keyword') ?? undefined,
    code: searchParams.get('code') ?? undefined,
    featureKey: searchParams.get('featureKey') ?? undefined,
    bedrooms: numberParam(searchParams, 'bedrooms'),
    bathrooms: numberParam(searchParams, 'bathrooms'),
    minArea: numberParam(searchParams, 'minArea'),
    maxArea: numberParam(searchParams, 'maxArea'),
    minPrice: numberParam(searchParams, 'minPrice'),
    maxPrice: numberParam(searchParams, 'maxPrice'),
    page,
    limit: DEFAULT_LIMIT,
    sort,
  })

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    next.set(key, value)
    if (key !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  const title = pageTitle(t, fixedPurpose)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/">{t('listings.breadcrumbHome')}</Link> {'>'} {title}
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">
          {t('listings.propertiesCount', {
            count: isLoading ? '...' : data?.total ?? 0,
          })}
        </h1>

        <PropertySort value={sort} onChange={(value) => updateParam('sort', value)} />
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full" />
          ))}
        </div>
      )}

      {!isLoading && (data?.items?.length ?? 0) === 0 && (
        <p className="text-muted-foreground">{t('listings.noResults')}</p>
      )}

      {!isLoading && (data?.items?.length ?? 0) > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {data && (
        <Pagination
          total={data.total ?? 0}
          page={data.page ?? page}
          limit={data.limit ?? DEFAULT_LIMIT}
          onPageChange={(nextPage) => updateParam('page', String(nextPage))}
        />
      )}
    </div>
  )
}

export default Listings
