import NotificationsPopover from '@/components/layout/NotificationsPopover'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

type HeaderActionsProps = {
  className?: string
}

// Ações fixas do header (idioma, notifiche), reusadas no desktop e no mobile
function HeaderActions({ className }: HeaderActionsProps) {
  return (
    <div className={className}>
      <LanguageSwitcher />
      <NotificationsPopover />
    </div>
  )
}

export default HeaderActions
