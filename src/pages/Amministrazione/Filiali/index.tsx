import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { Branch } from '@/api/generated/models'
import { useBranchList } from '@/pages/Amministrazione/Filiali/hooks/useBranchList'
import BranchTable from '@/pages/Amministrazione/Filiali/components/BranchTable'
import BranchFormModal from '@/pages/Amministrazione/Filiali/components/BranchFormModal'

function Filiali() {
  const { branches, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBranchList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  function handleNew() {
    setEditingBranch(null)
    setFormOpen(true)
  }

  function handleEdit(branch: Branch) {
    setEditingBranch(branch)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca una filiale..."
        onNewClick={handleNew}
        newLabel="Nuova filiale"
      />

      <BranchTable branches={branches} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <BranchFormModal open={formOpen} onOpenChange={setFormOpen} branch={editingBranch} />
    </div>
  )
}

export default Filiali
