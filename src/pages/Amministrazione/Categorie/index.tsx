import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PropertyCategory } from '@/api/generated/models'
import { useCategoryList } from '@/pages/Amministrazione/Categorie/hooks/useCategoryList'
import { useEditModalState } from '@/hooks/useEditModalState'
import CategoryTable from '@/pages/Amministrazione/Categorie/components/CategoryTable'
import CategoryFormModal from '@/pages/Amministrazione/Categorie/components/CategoryFormModal'

function Categorie() {
  const { t } = useTranslation('amministrazione')
  const { categories, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useCategoryList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<PropertyCategory>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('categorie.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('categorie.newLabel')}
      />

      <CategoryTable categories={categories} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <CategoryFormModal open={open} onOpenChange={setOpen} category={editing} />
    </div>
  )
}

export default Categorie
