import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable from '@/components/DataTable'
import type { CommunicationTemplate } from '@/api/generated/models'
import { useDeleteTemplate } from '@/pages/Marketing/hooks/useDeleteTemplate'
import { buildTemplateTableColumns } from '@/pages/Marketing/components/TemplateTableColumns'

type TemplateTableProps = {
  templates: CommunicationTemplate[]
  isLoading: boolean
  onEdit: (template: CommunicationTemplate) => void
}

function TemplateTable({ templates, isLoading, onEdit }: TemplateTableProps) {
  const { t } = useTranslation('marketing')
  const [deleteTarget, setDeleteTarget] = useState<CommunicationTemplate | null>(null)
  const { handleDelete } = useDeleteTemplate()

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns = buildTemplateTableColumns({ onEdit, onDelete: setDeleteTarget })

  return (
    <>
      <DataTable
        columns={columns}
        data={templates}
        keyExtractor={(template) => template.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('templateTable.empty')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('templateTable.deleteTitle')}
        description={t('templateTable.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('templateTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default TemplateTable
