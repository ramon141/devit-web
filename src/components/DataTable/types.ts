import type { ReactNode } from 'react'

export type DataTableColumn<TRow> = {
  header: ReactNode
  cell: (row: TRow) => ReactNode
  headerClassName?: string
  cellClassName?: string
  isActions?: boolean
}
