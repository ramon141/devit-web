import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { CommunicationOptOutWithRelations } from '@/api/generated/models'
import { formatDate } from '@/utils/formatDate'
import { useOptOutActions } from '@/pages/Marketing/hooks/useOptOutActions'

type OptOutTableProps = {
  optOuts: CommunicationOptOutWithRelations[]
  isLoading: boolean
}

function OptOutTable({ optOuts, isLoading }: OptOutTableProps) {
  const { t } = useTranslation('marketing')
  const { handleDelete } = useOptOutActions()
  const [deleteTarget, setDeleteTarget] = useState<CommunicationOptOutWithRelations | null>(null)

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns: DataTableColumn<CommunicationOptOutWithRelations>[] = [
    { header: t('optOutTable.person'), cell: (row) => row.person?.name ?? '—' },
    { header: t('optOutTable.channel'), cell: (row) => t(`templateChannelOptions.${row.channel}`) },
    { header: t('optOutTable.reason'), cell: (row) => row.reason ?? '—' },
    { header: t('optOutTable.date'), cell: (row) => formatDate(row.createdAt) },
    {
      header: t('optOutTable.actions'),
      headerClassName: 'w-16 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (row) => (
        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(row)}>
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={optOuts}
        keyExtractor={(row) => row.id ?? ''}
        isLoading={isLoading}
        emptyMessage={t('optOutTable.empty')}
      />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('optOutTable.deleteTitle')}
        description={t('optOutTable.deleteDescription', { name: deleteTarget?.person?.name })}
        variant="destructive"
        confirmLabel={t('optOutTable.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default OptOutTable
