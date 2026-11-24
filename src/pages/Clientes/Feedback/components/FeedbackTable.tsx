import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { ClientFeedbackWithRelations } from '@/api/generated/models'
import { useDeleteFeedback } from '@/pages/Clientes/Feedback/hooks/useDeleteFeedback'
import { buildFeedbackTableColumns } from '@/pages/Clientes/Feedback/components/FeedbackTableColumns'

type FeedbackTableProps = {
  feedbacks: ClientFeedbackWithRelations[]
  isLoading: boolean
  showPerson?: boolean
  onEdit: (feedback: ClientFeedbackWithRelations) => void
}

function FeedbackTable({ feedbacks, isLoading, showPerson = true, onEdit }: FeedbackTableProps) {
  const { t } = useTranslation('clientes')
  const [deleteTarget, setDeleteTarget] = useState<ClientFeedbackWithRelations | null>(null)
  const { handleDelete } = useDeleteFeedback()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildFeedbackTableColumns({
    t,
    showPerson,
    onEdit,
    onDelete: setDeleteTarget,
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={feedbacks}
        keyExtractor={(feedback) => feedback.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('feedbackTable.emptyMessage')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('feedbackTable.deleteTitle')}
        description={t('feedbackTable.deleteDescription')}
        variant="destructive"
        confirmLabel={t('feedbackTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default FeedbackTable
