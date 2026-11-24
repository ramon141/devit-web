import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TablePaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

const MAX_VISIBLE_BUTTONS = 7

// Intervalo de páginas do meio, entre a primeira e a última
function getMiddleRange(page: number, totalPages: number): [number, number] {
  const sidePages = Math.floor((MAX_VISIBLE_BUTTONS - 3) / 2)

  if (page <= sidePages + 2) {
    return [2, Math.min(MAX_VISIBLE_BUTTONS - 1, totalPages - 1)]
  }

  if (page >= totalPages - sidePages - 1) {
    return [Math.max(totalPages - MAX_VISIBLE_BUTTONS + 2, 2), totalPages - 1]
  }

  return [page - sidePages, page + sidePages]
}

// Até 7 botões: primeira, janela ao redor da atual, última; lacunas viram reticências
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= MAX_VISIBLE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const [start, end] = getMiddleRange(page, totalPages)
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  return [
    1,
    ...(start > 2 ? ['start-ellipsis' as const] : []),
    ...middle,
    ...(end < totalPages - 1 ? ['end-ellipsis' as const] : []),
    totalPages,
  ]
}

const baseButton = 'h-9 min-w-9 rounded-xl border border-border px-2 font-normal text-foreground'

// Paginação simples baseada em skip/limit (padrão loopback do devit-api)
function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: TablePaginationProps) {
  const { t } = useTranslation('common')
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
      <span>
        {t('tablePagination.summary', { page, totalPages, count: totalItems })}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          aria-label={t('tablePagination.previous')}
          className={cn(baseButton, 'bg-white hover:bg-accent')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <Button
              key={item}
              variant={item === page ? 'default' : 'ghost'}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                baseButton,
                item === page && 'font-bold text-primary-foreground',
                item === page + 1 && 'bg-primary/20 text-foreground',
                item !== page && item !== page + 1 && 'bg-white hover:bg-accent',
              )}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ) : (
            <span key={item} className="px-1">
              ...
            </span>
          ),
        )}

        <Button
          variant="ghost"
          aria-label={t('tablePagination.next')}
          className={cn(baseButton, 'bg-white hover:bg-accent')}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
