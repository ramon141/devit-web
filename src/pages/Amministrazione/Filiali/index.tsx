import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { Branch } from '@/api/generated/models'
import { useBranchList } from '@/pages/Amministrazione/Filiali/hooks/useBranchList'
import { useEditModalState } from '@/hooks/useEditModalState'
import BranchTable from '@/pages/Amministrazione/Filiali/components/BranchTable'
import BranchFormModal from '@/pages/Amministrazione/Filiali/components/BranchFormModal'

function Filiali() {
  const { branches, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useBranchList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<Branch>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca una filiale..."
        onNewClick={openNew}
        newLabel="Nuova filiale"
      />

      <BranchTable branches={branches} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <BranchFormModal open={open} onOpenChange={setOpen} branch={editing} />
    </div>
  )
}

export default Filiali
