import { useSearchParams } from 'react-router'
import { formatNumber, useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import Breadcrumb from '@/pages/Site/components/Breadcrumb'
import Room from '@/pages/Site/components/Room'
import SearchFilters from '@/pages/Site/components/SearchFilters'
import { readFilters, readSort, toFindParams } from '@/pages/Site/components/SearchFilters/filterValues'
import { usePageMeta } from '@/pages/Site/hooks/usePageMeta'
import { useMotionReady } from '@/pages/Site/hooks/useMotionReady'
import { usePropertyList } from '@/pages/Site/hooks/useSiteData'
import ListPagination from '@/pages/Site/Properties/components/ListPagination'
import PropertyGrid from '@/pages/Site/Properties/components/PropertyGrid'
import SortLinks from '@/pages/Site/Properties/components/SortLinks'

function Properties() {
  const { dict, locale } = useSiteDict()
  const [searchParams] = useSearchParams()
  const { data } = usePropertyList(toFindParams(searchParams))

  usePageMeta(dict.list.title, dict.home.heroLead)
  useMotionReady(!!data)

  const filters = readFilters(searchParams)
  const total = data?.total ?? 0
  const limit = data?.limit || 1

  return (
    <div className="py-12">
      <Room className="pb-2">
        <div className="container-devit">
          <Breadcrumb
            items={[{ label: dict.nav.home, to: SITE_PATHS.home }, { label: dict.list.title }]}
          />

          <header className="mb-10 border-b border-site-line pb-8">
            <h1 className="text-[clamp(2.2rem,5vw,3.4rem)]">{dict.list.title}</h1>
            <p className="mt-3 text-site-ink-soft">
              <strong className="font-semibold text-site-ink">{formatNumber(total, locale)}</strong>{' '}
              {total === 1 ? dict.list.resultsOne : dict.list.resultsMany}
            </p>
          </header>
        </div>
      </Room>

      <Room className="pt-2">
        <div className="container-devit grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-[92px] lg:self-start">
            <h2 className="mb-5 font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-ink">
              {dict.search.filters}
            </h2>
            <SearchFilters key={searchParams.toString()} current={filters} />
          </aside>

          <section>
            <SortLinks filters={filters} active={readSort(searchParams)} />
            {data && <PropertyGrid items={data.items ?? []} />}
            <ListPagination
              filters={filters}
              sort={searchParams.get('sort') ?? ''}
              page={data?.page ?? 1}
              totalPages={Math.max(1, Math.ceil(total / limit))}
            />
          </section>
        </div>
      </Room>
    </div>
  )
}

export default Properties
