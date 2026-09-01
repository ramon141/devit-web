import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DataTableColumn } from '@/components/DataTable'
import type { CommunicationTemplate } from '@/api/generated/models'
import i18n from '@/i18n'

type BuildTemplateTableColumnsProps = {
  onEdit: (template: CommunicationTemplate) => void
  onDelete: (template: CommunicationTemplate) => void
}

export function buildTemplateTableColumns({
  onEdit,
  onDelete,
}: BuildTemplateTableColumnsProps): DataTableColumn<CommunicationTemplate>[] {
  const t = (key: string) => i18n.t(`marketing:${key}`)

  return [
    { header: t('templateTableColumns.name'), cell: (template) => <span className="font-medium">{template.name}</span> },
    { header: t('templateTableColumns.channel'), cell: (template) => t(`templateChannelOptions.${template.channel}`) },
    { header: t('templateTableColumns.category'), cell: (template) => t(`templateCategoryOptions.${template.category}`) },
    {
      header: t('templateTableColumns.status'),
      cell: (template) => (
        <Badge variant={template.active ? 'default' : 'secondary'}>
          {template.active ? t('templateTableColumns.active') : t('templateTableColumns.inactive')}
        </Badge>
      ),
    },
    {
      header: t('templateTableColumns.actions'),
      headerClassName: 'w-24 text-right',
      cellClassName: 'text-right',
      isActions: true,
      cell: (template) => (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(template)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(template)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </>
      ),
    },
  ]
}
