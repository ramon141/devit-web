import { useNotificationControllerCount } from '@/api/generated/api'
import { UserInfo } from '@/auth'

export function useUnreadNotificationsCount() {
  const userId = UserInfo.getUserId()

  const { data } = useNotificationControllerCount({
    where: { userId, readAt: null },
  })

  return data?.count ?? 0
}
