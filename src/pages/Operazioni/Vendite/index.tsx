import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleList } from '@/pages/Operazioni/Vendite/hooks/useSaleList'
import { useEditModalState } from '@/hooks/useEditModalState'
import SaleTable from '@/pages/Operazioni/Vendite/components/SaleTable'
import SaleFormModal from '@/pages/Operazioni/Vendite/components/SaleFormModal'

function Vendite() {
  const { t } = useTranslation('operazioni')
  const { sales, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useSaleList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<SaleWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('vendite.index.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('vendite.index.newLabel')}
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
