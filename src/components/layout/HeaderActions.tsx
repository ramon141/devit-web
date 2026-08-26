import NotificationsPopover from '@/components/layout/NotificationsPopover'

type HeaderActionsProps = {
  className?: string
}

// Ações fixas do header (notifiche), reusadas no desktop e no mobile
function HeaderActions({ className }: HeaderActionsProps) {
  return (
    <div className={className}>
      <NotificationsPopover />
    </div>
  )
}

export default HeaderActions
