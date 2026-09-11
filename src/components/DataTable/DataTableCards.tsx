import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DataTableColumn } from '@/components/DataTable/types'

const SKELETON_CARDS = 3

type DataTableCardsProps<TRow> = {
  columns: DataTableColumn<TRow>[]
  data: TRow[]
  keyExtractor: (row: TRow) => string
  isLoading: boolean
  emptyMessage: string
  onRowClick?: (row: TRow) => void
}

function DataTableCard<TRow>({
  row,
  fieldColumns,
  actionsColumn,
  onRowClick,
}: {
  row: TRow
  fieldColumns: DataTableColumn<TRow>[]
  actionsColumn?: DataTableColumn<TRow>
  onRowClick?: (row: TRow) => void
}) {
  return (
    <div
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      className={cn(
        'grid gap-2 rounded-xl border border-border bg-card p-4',
        onRowClick && 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {fieldColumns.map((column, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">{column.header}</span>
          <span className="text-right font-medium">{column.cell(row)}</span>
        </div>
      ))}

      {actionsColumn && (
        <>
          <Separator className="my-1" />
          <div className="flex justify-end gap-1">{actionsColumn.cell(row)}</div>
        </>
      )}
    </div>
  )
}

// Cards de carregamento com uma linha por coluna exibida
function DataTableCardsSkeleton({ fieldCount }: { fieldCount: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: SKELETON_CARDS }).map((_, cardIndex) => (
        <div key={cardIndex} className="grid gap-2 rounded-xl border border-border bg-card p-4">
          {Array.from({ length: fieldCount }).map((_, fieldIndex) => (
            <div key={fieldIndex} className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function DataTableCards<TRow>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage,
  onRowClick,
}: DataTableCardsProps<TRow>) {
  if (isLoading && data.length === 0) {
    const fieldCount = columns.filter((column) => !column.isActions).length

    return <DataTableCardsSkeleton fieldCount={fieldCount} />
  }

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
  }

  const fieldColumns = columns.filter((column) => !column.isActions)
  const actionsColumn = columns.find((column) => column.isActions)

  return (
    <div className="grid gap-3">
      {data.map((row) => (
        <DataTableCard
          key={keyExtractor(row)}
          row={row}
          fieldColumns={fieldColumns}
          actionsColumn={actionsColumn}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  )
}

export default DataTableCards
