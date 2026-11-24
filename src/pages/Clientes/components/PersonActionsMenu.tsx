import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  BuildingIcon,
  EyeIcon,
  MessageSquareIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import ActionsMenu from '@/components/ActionsMenu'
import type { PersonWithRelations } from '@/api/generated/models'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

export type PersonActionHandlers = {
  onEdit: (person: PersonWithRelations) => void
  onDelete: (person: PersonWithRelations) => void
  onViewFeedback: (person: PersonWithRelations) => void
  onViewProperties: (person: PersonWithRelations) => void
}

type PersonActionsMenuProps = PersonActionHandlers & {
  person: PersonWithRelations
}

function PersonActionsMenu({
  person,
  onEdit,
  onDelete,
  onViewFeedback,
  onViewProperties,
}: PersonActionsMenuProps) {
  const { t } = useTranslation('clientes')

  return (
    <ActionsMenu
      ariaLabel={t('personTableColumns.actions')}
      items={[
        {
          label: t('personTableColumns.view'),
          icon: <EyeIcon className="size-4" />,
          color: '#1565c0',
          render: <Link to={`${CRM_BASE_PATH}/clienti/${person.id}`} />,
        },
        {
          label: t('personTableColumns.properties'),
          icon: <BuildingIcon className="size-4" />,
          color: '#2e7d32',
          onClick: () => onViewProperties(person),
        },
        {
          label: t('personTableColumns.feedback'),
          icon: <MessageSquareIcon className="size-4" />,
          color: '#7c3aed',
          onClick: () => onViewFeedback(person),
        },
        {
          label: t('personTableColumns.edit'),
          icon: <PencilIcon className="size-4" />,
          color: '#f59e0b',
          onClick: () => onEdit(person),
        },
        {
          label: t('personTableColumns.delete'),
          icon: <Trash2Icon className="size-4" />,
          color: '#dc2626',
          onClick: () => onDelete(person),
          destructive: true,
        },
      ]}
    />
  )
}

export default PersonActionsMenu
