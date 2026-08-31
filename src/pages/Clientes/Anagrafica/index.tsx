import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import TablePagination from '@/components/TablePagination'
import type { PersonWithRelations } from '@/api/generated/models'
import { usePersonList } from '@/pages/Clientes/hooks/usePersonList'
import { getPersonRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import { useEditModalState } from '@/hooks/useEditModalState'
import PersonTable from '@/pages/Clientes/components/PersonTable'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

function Anagrafica() {
  const { t } = useTranslation('clientes')
  const {
    people,
    where,
    isLoading,
    totalItems,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    roleFilter,
    setRoleFilter,
  } = usePersonList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<PersonWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('anagrafica.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('anagrafica.newLabel')}
        actions={<ExportMenu path="/people/export" params={{ filter: { where } }} />}
        filters={
          <div className="w-full sm:w-48">
            <FormFieldWrapper label={t('anagrafica.roleFilterLabel')}>
              <SelectField
                value={roleFilter}
                onValueChange={setRoleFilter}
                options={getPersonRoleOptions(t)}
                placeholder={t('anagrafica.roleFilterAll')}
              />
            </FormFieldWrapper>
          </div>
        }
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
