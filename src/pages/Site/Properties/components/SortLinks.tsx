import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import { DEFAULT_SORT, type SortKey } from '@/lib/site/types'
import { toSearchString, type FilterValues } from '@/pages/Site/components/SearchFilters/filterValues'

type SortLinksProps = {
  filters: FilterValues
  active: SortKey
}

const ACTIVE = 'font-semibold text-site-ink underline decoration-site-accent decoration-2 underline-offset-4'
const IDLE = 'text-site-ink-soft transition-colors hover:text-site-ink'

function SortLinks({ filters, active }: SortLinksProps) {
  const { dict } = useSiteDict()

  const sorts: Array<{ key: SortKey; label: string }> = [
    { key: 'featured', label: dict.list.sortFeatured },
    { key: 'date-desc', label: dict.list.sortRecent },
    { key: 'price-asc', label: dict.list.sortPriceAsc },
    { key: 'price-desc', label: dict.list.sortPriceDesc },
  ]

  function hrefFor(key: SortKey) {
    const search = toSearchString(filters, key === DEFAULT_SORT ? {} : { sort: key })

    return `${SITE_PATHS.properties}${search ? `?${search}` : ''}`
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="font-site-mono text-[0.7rem] uppercase tracking-[0.14em] text-site-muted">
        {dict.list.sort}
      </span>
      {sorts.map((sort) => (
        <Link
          key={sort.key}
          to={hrefFor(sort.key)}
          aria-current={active === sort.key ? 'true' : undefined}
          className={active === sort.key ? ACTIVE : IDLE}
        >
          {sort.label}
        </Link>
      ))}
    </div>
  )
}

export default SortLinks
