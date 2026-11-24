import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DataTableColumn } from '@/components/DataTable/types'

const SKELETON_ROWS = 5

type DataTableGridProps<TRow> = {
  columns: DataTableColumn<TRow>[]
  data: TRow[]
  keyExtractor: (row: TRow) => string
  isLoading: boolean
  emptyMessage: string
  onRowClick?: (row: TRow) => void
}

function DataTableGridRow<TRow>({
  row,
  columns,
  keyExtractor,
  onRowClick,
}: {
  row: TRow
  columns: DataTableColumn<TRow>[]
  keyExtractor: (row: TRow) => string
  onRowClick?: (row: TRow) => void
}) {
  return (
    <TableRow
      key={keyExtractor(row)}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      className={cn(onRowClick && 'cursor-pointer')}
    >
      {columns.map((column, index) => (
        <TableCell key={index} className={cn('px-4', column.cellClassName)}>
          {column.isActions ? (
            column.cell(row)
          ) : (
            <div className="max-w-[320px] overflow-hidden truncate">
              {column.cell(row)}
            </div>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Linhas de carregamento com a mesma quantidade de colunas da tabela
function DataTableGridSkeletonRows({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function DataTableGrid<TRow>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage,
  onRowClick,
}: DataTableGridProps<TRow>) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
      <Table>
        <TableHeader className="bg-primary/20">
          <TableRow className="border-0 hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn('h-10 px-4 font-medium', column.headerClassName)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:nth-child(even):not(:hover)]:bg-[#E9E8E1]">
          {isLoading && data.length === 0 && (
            <DataTableGridSkeletonRows columnCount={columns.length} />
          )}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {data.map((row) => (
            <DataTableGridRow
              key={keyExtractor(row)}
              row={row}
              columns={columns}
              keyExtractor={keyExtractor}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DataTableGrid
