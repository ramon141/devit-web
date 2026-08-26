import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleList } from '@/pages/Operazioni/Vendite/hooks/useSaleList'
import { useEditModalState } from '@/hooks/useEditModalState'
import SaleTable from '@/pages/Operazioni/Vendite/components/SaleTable'
import SaleFormModal from '@/pages/Operazioni/Vendite/components/SaleFormModal'

function Vendite() {
  const { sales, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useSaleList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<SaleWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca per numero..."
        onNewClick={openNew}
        newLabel="Nuova vendita"
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
