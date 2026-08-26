import { useIsDesktop } from '@/hooks/useIsDesktop'
import DataTableGrid from '@/components/DataTable/DataTableGrid'
import DataTableCards from '@/components/DataTable/DataTableCards'
import type { DataTableColumn } from '@/components/DataTable/types'

export type { DataTableColumn }

type DataTableProps<TRow> = {
  columns: DataTableColumn<TRow>[]
  data: TRow[]
  keyExtractor: (row: TRow) => string
  isLoading?: boolean
  emptyMessage: string
  onRowClick?: (row: TRow) => void
}

function DataTable<TRow>({ isLoading = false, ...props }: DataTableProps<TRow>) {
  const isDesktop = useIsDesktop()
  const Component = isDesktop ? DataTableGrid : DataTableCards

  return <Component {...props} isLoading={isLoading} />
}

export default DataTable
