import { useState } from 'react'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PropertyCategory } from '@/api/generated/models'
import { useCategoryList } from '@/pages/Amministrazione/Categorie/hooks/useCategoryList'
import CategoryTable from '@/pages/Amministrazione/Categorie/components/CategoryTable'
import CategoryFormModal from '@/pages/Amministrazione/Categorie/components/CategoryFormModal'

function Categorie() {
  const { categories, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useCategoryList()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<PropertyCategory | null>(null)

  function handleNew() {
    setEditingCategory(null)
    setFormOpen(true)
  }

  function handleEdit(category: PropertyCategory) {
    setEditingCategory(category)
    setFormOpen(true)
  }

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca una categoria..."
        onNewClick={handleNew}
        newLabel="Nuova categoria"
      />

      <CategoryTable categories={categories} isLoading={isLoading} onEdit={handleEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <CategoryFormModal open={formOpen} onOpenChange={setFormOpen} category={editingCategory} />
    </div>
  )
}

export default Categorie
