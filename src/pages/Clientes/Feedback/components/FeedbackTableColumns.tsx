import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import type { TFunction } from 'i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { ClientFeedbackWithRelations } from '@/api/generated/models'
import { getFeedbackTypeOptions } from '@/pages/Clientes/Feedback/schemas/feedbackSchema'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { formatBroker } from '@/utils/formatBroker'
import { formatDateTime } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'

type BuildFeedbackTableColumnsProps = {
  t: TFunction<'clientes'>
  // Na ficha do cliente a coluna "Cliente" é redundante
  showPerson: boolean
  onEdit: (feedback: ClientFeedbackWithRelations) => void
  onDelete: (feedback: ClientFeedbackWithRelations) => void
}

export function buildFeedbackTableColumns({
  t,
  showPerson,
  onEdit,
  onDelete,
}: BuildFeedbackTableColumnsProps): DataTableColumn<ClientFeedbackWithRelations>[] {
  const typeOptions = getFeedbackTypeOptions(t)

  const personColumn: DataTableColumn<ClientFeedbackWithRelations> = {
    header: t('feedbackTableColumns.person'),
    cell: (feedback) =>
      feedback.person ? (
        <Link
          className="font-medium hover:underline"
          to={`${CRM_BASE_PATH}/clienti/${feedback.personId}`}
        >
          {feedback.person.name}
        </Link>
      ) : (
        '—'
      ),
  }

  return [
    {
      header: t('feedbackTableColumns.date'),
      cell: (feedback) => formatDateTime(feedback.createdAt),
    },
    ...(showPerson ? [personColumn] : []),
    {
      header: t('feedbackTableColumns.type'),
      cell: (feedback) => (
        <Badge variant="secondary">{getOptionLabel(typeOptions, feedback.type)}</Badge>
      ),
    },
    {
      header: t('feedbackTableColumns.property'),
      cell: (feedback) =>
        feedback.property ? `${feedback.property.code} · ${feedback.property.title}` : '—',
    },
    {
      header: t('feedbackTableColumns.content'),
      cellClassName: 'max-w-md whitespace-pre-wrap break-words',
      cell: (feedback) => feedback.content,
    },
    {
      header: t('feedbackTableColumns.createdBy'),
      cell: (feedback) => formatBroker(feedback.createdBy),
    },
    {
      header: t('feedbackTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (feedback) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(feedback)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(feedback)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
