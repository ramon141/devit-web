import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useUserList } from '@/pages/Amministrazione/Utenti/hooks/useUserList'
import { useEditModalState } from '@/hooks/useEditModalState'
import UserTable from '@/pages/Amministrazione/Utenti/components/UserTable'
import UserFormModal from '@/pages/Amministrazione/Utenti/components/UserFormModal'

function Utenti() {
  const { users, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useUserList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<UserExcludingPasswordHashWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca un utente per nome..."
        onNewClick={openNew}
        newLabel="Nuovo utente"
      />

      <UserTable users={users} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <UserFormModal open={open} onOpenChange={setOpen} user={editing} />
    </div>
  )
}

export default Utenti
