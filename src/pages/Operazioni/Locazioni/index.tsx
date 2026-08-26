import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useRentalContractList } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractList'
import { useEditModalState } from '@/hooks/useEditModalState'
import RentalTable from '@/pages/Operazioni/Locazioni/components/RentalTable'
import RentalFormModal from '@/pages/Operazioni/Locazioni/components/RentalFormModal'

function Locazioni() {
  const { t } = useTranslation('operazioni')
  const { contracts, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useRentalContractList()
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<RentalContractWithRelations>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('locazioni.index.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('locazioni.index.newLabel')}
      />

      <RentalTable contracts={contracts} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <RentalFormModal open={open} onOpenChange={setOpen} contract={editing} />
    </div>
  )
}

export default Locazioni
