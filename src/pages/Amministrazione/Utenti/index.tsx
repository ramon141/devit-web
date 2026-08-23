import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useUserList } from '@/pages/Amministrazione/Utenti/hooks/useUserList'
import UserTable from '@/pages/Amministrazione/Utenti/components/UserTable'
import UserFormModal from '@/pages/Amministrazione/Utenti/components/UserFormModal'

function Utenti() {
  const { users, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useUserList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserExcludingPasswordHashWithRelations | null>(
    null
  )

  function handleNew() {
    setEditingUser(null)
    setFormOpen(true)
  }

  function handleEdit(user: UserExcludingPasswordHashWithRelations) {
    setEditingUser(user)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca un utente per nome..."
        onNewClick={handleNew}
        newLabel="Nuovo utente"
      />

      <UserTable users={users} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <UserFormModal open={formOpen} onOpenChange={setFormOpen} user={editingUser} />
    </div>
  )
}

export default Utenti
