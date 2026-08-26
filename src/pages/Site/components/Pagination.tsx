import { Button } from '@/components/ui/button'

type PaginationProps = {
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
}

function visiblePages(page: number, totalPages: number) {
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)

  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  return pages
}

function Pagination({ total, page, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Precedente
      </Button>

      {visiblePages(page, totalPages).map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Successivo
      </Button>
    </div>
  )
}

export default Pagination
