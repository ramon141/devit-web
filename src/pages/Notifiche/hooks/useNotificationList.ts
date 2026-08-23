import { useQueryClient } from '@tanstack/react-query'
import {
  getNotificationControllerCountQueryKey,
  getNotificationControllerFindQueryKey,
  useNotificationControllerFind,
  useNotificationControllerUpdateById,
} from '@/api/generated/api'
import { UserInfo } from '@/auth'

export function useNotificationList(limit?: number) {
  const userId = UserInfo.getUserId()
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useNotificationControllerFind({
    filter: { where: { userId }, order: ['createdAt DESC'], limit },
  })
  const { mutate: updateNotification } = useNotificationControllerUpdateById()

  function markAsRead(id: string) {
    updateNotification(
      { id, data: { readAt: new Date().toISOString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getNotificationControllerFindQueryKey() })
          queryClient.invalidateQueries({ queryKey: getNotificationControllerCountQueryKey() })
        },
      }
    )
  }

  return {
    notifications: notifications ?? [],
    isLoading,
    markAsRead,
  }
}
