import { CheckIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { useNotificationList } from '@/pages/Notifiche/hooks/useNotificationList'
import { NOTIFICATION_TYPE_LABELS } from '@/constants/notifications'
import { formatDateTime } from '@/utils/formatDate'

function Notifiche() {
  const { t } = useTranslation('notifiche')
  const { notifications, isLoading, markAsRead } = useNotificationList()

  return (
    <AppLayout
      title={t('notificheList.title')}
      description={t('notificheList.description')}
      breadcrumbItems={[{ label: t('notificheList.breadcrumb') }]}
    >
      <div className="grid gap-2">
        {!isLoading && notifications.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">{t('notificheList.emptyState')}</p>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-border"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary">
                {NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}
              </p>
              <p className="truncate text-sm font-medium">{notification.title}</p>
              {notification.message && (
                <p className="truncate text-sm text-muted-foreground">{notification.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDateTime(notification.createdAt)}
              </p>
            </div>

            {!notification.readAt && notification.id && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => markAsRead(notification.id as string)}
              >
                <CheckIcon className="size-4" />
                <span className="sr-only">{t('notificheList.markAsRead')}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  )
}

export default Notifiche
