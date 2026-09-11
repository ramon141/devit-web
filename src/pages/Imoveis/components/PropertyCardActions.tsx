import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CopyIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import type { PropertyWithRelations } from '@/api/generated/models'
import { useDeleteProperty } from '@/pages/Imoveis/hooks/useDeleteProperty'
import { useDuplicateProperty } from '@/pages/Imoveis/hooks/useDuplicateProperty'

type PropertyCardActionsProps = {
  property: PropertyWithRelations
}

function PropertyCardActions({ property }: PropertyCardActionsProps) {
  const { t } = useTranslation('imoveis')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { handleDelete } = useDeleteProperty()
  const { handleDuplicate } = useDuplicateProperty()

  function confirmDelete() {
    if (property.id) handleDelete(property.id)
    setConfirmOpen(false)
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        nativeButton={false}
        title={t('card.edit')}
        render={<Link to={`${CRM_BASE_PATH}/proprieta/${property.id}`} />}
      >
        <PencilIcon className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        title={t('card.duplicate')}
        onClick={() => handleDuplicate(property)}
      >
        <CopyIcon className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        title={t('card.deleteConfirm')}
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2Icon className="size-4 text-destructive" />
      </Button>

      <ConfirmPopup
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('card.deleteTitle')}
        description={t('card.deleteDescription', { title: property.title })}
        variant="destructive"
        confirmLabel={t('card.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default PropertyCardActions
