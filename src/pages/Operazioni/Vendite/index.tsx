import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleList } from '@/pages/Operazioni/Vendite/hooks/useSaleList'
import SaleTable from '@/pages/Operazioni/Vendite/components/SaleTable'
import SaleFormModal from '@/pages/Operazioni/Vendite/components/SaleFormModal'

function Vendite() {
  const { sales, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useSaleList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<SaleWithRelations | null>(null)

  function handleNew() {
    setEditingSale(null)
    setFormOpen(true)
  }

  function handleEdit(sale: SaleWithRelations) {
    setEditingSale(sale)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca per numero..."
        onNewClick={handleNew}
        newLabel="Nuova vendita"
      />

      <SaleTable sales={sales} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <SaleFormModal open={formOpen} onOpenChange={setFormOpen} sale={editingSale} />
    </div>
  )
}

export default Vendite
