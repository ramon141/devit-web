import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { PersonWithRelations } from '@/api/generated/models'
import { usePersonList } from '@/pages/Clientes/hooks/usePersonList'
import { useEditModalState } from '@/hooks/useEditModalState'
import PersonTable from '@/pages/Clientes/components/PersonTable'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

function Anagrafica() {
  const { t } = useTranslation('clientes')
  const { people, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    usePersonList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<PersonWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('anagrafica.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('anagrafica.newLabel')}
      />

      <PersonTable people={people} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <PersonFormModal open={open} onOpenChange={setOpen} person={editing} />
    </div>
  )
}

export default Anagrafica
