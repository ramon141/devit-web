import { useState } from 'react'
import { UserPlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import NotificationsPopover from '@/components/layout/NotificationsPopover'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

type HeaderActionsProps = {
  className?: string
}

// Ações fixas do header (nuovo contatto, notifiche), reusadas no desktop e no mobile
function HeaderActions({ className }: HeaderActionsProps) {
  const { t } = useTranslation('common')
  const [newContactOpen, setNewContactOpen] = useState(false)

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        title={t('headerActions.newContact')}
        aria-label={t('headerActions.newContact')}
        onClick={() => setNewContactOpen(true)}
      >
        <UserPlusIcon className="size-4.5" />
      </Button>

      <NotificationsPopover />

      <PersonFormModal open={newContactOpen} onOpenChange={setNewContactOpen} />
    </div>
  )
}

export default HeaderActions
