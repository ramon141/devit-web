import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import TablePagination from '@/components/TablePagination'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleList } from '@/pages/Operazioni/Vendite/hooks/useSaleList'
import { useEditModalState } from '@/hooks/useEditModalState'
import SaleTable from '@/pages/Operazioni/Vendite/components/SaleTable'
import SaleFormModal from '@/pages/Operazioni/Vendite/components/SaleFormModal'
import SaleFilters from '@/pages/Operazioni/Vendite/components/SaleFilters'

function Vendite() {
  const { t } = useTranslation('operazioni')
  const {
    sales,
    where,
    isLoading,
    totalItems,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    filters,
    setFilters,
  } = useSaleList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<SaleWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('vendite.index.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('vendite.index.newLabel')}
        filters={<SaleFilters filters={filters} onChange={setFilters} />}
        actions={<ExportMenu path="/sales/export" params={{ filter: { where } }} />}
      />

      <SaleTable sales={sales} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <SaleFormModal open={open} onOpenChange={setOpen} sale={editing} />
    </div>
  )
}

export default Vendite
