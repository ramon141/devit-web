import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import { toSearchString, type FilterValues } from '@/pages/Site/components/SearchFilters/filterValues'

type ListPaginationProps = {
  filters: FilterValues
  sort: string
  page: number
  totalPages: number
}

const BUTTON = 'rounded-lg border border-site-line px-5 py-2.5 text-sm transition-colors hover:border-site-ink'

function ListPagination({ filters, sort, page, totalPages }: ListPaginationProps) {
  const { dict } = useSiteDict()

  function hrefFor(target: number) {
    const extra: Record<string, string> = {}
    if (sort) extra.sort = sort
    if (target > 1) extra.page = String(target)
    const search = toSearchString(filters, extra)

    return `${SITE_PATHS.properties}${search ? `?${search}` : ''}`
  }

  if (totalPages <= 1) return null

  return (
    <nav
      aria-label={dict.list.page}
      className="mt-14 flex items-center justify-between gap-4 border-t border-site-line pt-8"
    >
      {page > 1 ? (
        <Link to={hrefFor(page - 1)} rel="prev" className={BUTTON}>
          ← {dict.list.previous}
        </Link>
      ) : (
        <span />
      )}

      <p className="font-site-mono text-[0.75rem] uppercase tracking-[0.14em] text-site-muted">
        {dict.list.page} {page} {dict.list.of} {totalPages}
      </p>

      {page < totalPages ? (
        <Link to={hrefFor(page + 1)} rel="next" className={BUTTON}>
          {dict.list.next} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default ListPagination
