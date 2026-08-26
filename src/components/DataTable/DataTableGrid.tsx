import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { DataTableColumn } from '@/components/DataTable/types'

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
        <TableCell key={index} className={column.cellClassName}>
          {column.cell(row)}
        </TableCell>
      ))}
    </TableRow>
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
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
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
