import { useTranslation } from 'react-i18next'
import { MessageSquarePlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { ClientFeedbackWithRelations } from '@/api/generated/models'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useFeedbackList } from '@/pages/Clientes/Feedback/hooks/useFeedbackList'
import FeedbackFilters from '@/pages/Clientes/Feedback/components/FeedbackFilters'
import FeedbackTable from '@/pages/Clientes/Feedback/components/FeedbackTable'
import FeedbackFormModal from '@/pages/Clientes/Feedback/components/FeedbackFormModal'

type FeedbackProps = {
  // Na ficha do cliente a lista mostra só os feedbacks dele
  personId?: string
  // Esconde busca e filtros (ex.: modal da listagem de clientes)
  hideFilters?: boolean
}

function Feedback({ personId, hideFilters = false }: FeedbackProps) {
  const { t } = useTranslation('clientes')
  const list = useFeedbackList({ personId })
  const { open, setOpen, editing, openNew, openEdit } =
    useEditModalState<ClientFeedbackWithRelations>()

  return (
    <div>
      {hideFilters ? (
        <div className="mb-4 flex justify-end">
          <Button onClick={openNew}>
            <MessageSquarePlusIcon className="size-4" />
            {t('feedback.newLabel')}
          </Button>
        </div>
      ) : (
        <ListToolbar
          search={list.search}
          onSearchChange={list.onSearchChange}
          searchPlaceholder={t('feedback.searchPlaceholder')}
          onNewClick={openNew}
          newLabel={t('feedback.newLabel')}
          newIcon={MessageSquarePlusIcon}
          filters={
            <FeedbackFilters
              typeFilter={list.typeFilter}
              onTypeChange={list.setTypeFilter}
              propertyFilter={list.propertyFilter}
              onPropertyChange={list.setPropertyFilter}
              leadFilter={list.leadFilter}
              onLeadChange={list.setLeadFilter}
            />
          }
        />
      )}

      <FeedbackTable
        feedbacks={list.feedbacks}
        isLoading={list.isLoading}
        showPerson={!personId}
        onEdit={openEdit}
      />

      <TablePagination
        page={list.page}
        pageSize={list.pageSize}
        totalItems={list.totalItems}
        onPageChange={list.setPage}
      />

      <FeedbackFormModal
        open={open}
        onOpenChange={setOpen}
        feedback={editing}
        fixedPersonId={personId}
      />
    </div>
  )
}

export default Feedback
