import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useRentalContractList } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractList'
import RentalTable from '@/pages/Operazioni/Locazioni/components/RentalTable'
import RentalFormModal from '@/pages/Operazioni/Locazioni/components/RentalFormModal'

function Locazioni() {
  const { contracts, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useRentalContractList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<RentalContractWithRelations | null>(
    null
  )

  function handleNew() {
    setEditingContract(null)
    setFormOpen(true)
  }

  function handleEdit(contract: RentalContractWithRelations) {
    setEditingContract(contract)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca per numero..."
        onNewClick={handleNew}
        newLabel="Nuovo contratto"
      />

      <RentalTable contracts={contracts} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <RentalFormModal open={formOpen} onOpenChange={setFormOpen} contract={editingContract} />
    </div>
  )
}

export default Locazioni
