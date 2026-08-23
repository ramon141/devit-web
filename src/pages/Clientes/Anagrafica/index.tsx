import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { Person } from '@/api/generated/models'
import { usePersonList } from '@/pages/Clientes/hooks/usePersonList'
import PersonTable from '@/pages/Clientes/components/PersonTable'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

function Anagrafica() {
  const { people, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    usePersonList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)

  function handleNew() {
    setEditingPerson(null)
    setFormOpen(true)
  }

  function handleEdit(person: Person) {
    setEditingPerson(person)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca un cliente per nome..."
        onNewClick={handleNew}
        newLabel="Nuovo cliente"
      />

      <PersonTable people={people} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <PersonFormModal open={formOpen} onOpenChange={setFormOpen} person={editingPerson} />
    </div>
  )
}

export default Anagrafica
