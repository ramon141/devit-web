import { Bell } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNotificationList } from '@/pages/Notifiche/hooks/useNotificationList'
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_POPOVER_LIMIT } from '@/constants/notifications'
import { useUnreadNotificationsCount } from '@/hooks/useUnreadNotificationsCount'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { formatDateTime } from '@/utils/formatDate'

// Popover com as últimas notificações, com link para a lista completa
function NotificationsPopover() {
  const unreadCount = useUnreadNotificationsCount()
  const { notifications, isLoading } = useNotificationList(NOTIFICATION_POPOVER_LIMIT)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Notifiche</span>
          </Button>
        }
      />

      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Notifiche</PopoverTitle>
        </PopoverHeader>

        <div className="grid gap-1">
          {!isLoading && notifications.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">Nessuna notifica.</p>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="grid gap-0.5 rounded-lg px-2 py-1.5 hover:bg-muted"
            >
              <p className="text-xs font-medium text-primary">
                {NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}
              </p>
              <p className="truncate text-sm font-medium">{notification.title}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatDateTime(notification.createdAt)}
              </p>
            </div>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="w-full" nativeButton={false} render={<Link to={`${CRM_BASE_PATH}/notifiche`} />}>
          Vedi tutte
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationsPopover
