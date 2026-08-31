import { useTranslation } from 'react-i18next'
import {
  useAttachmentControllerFindById,
  useBranchControllerFindById,
  useUserControllerFindById,
} from '@/api/generated/api'
import { UserAccessLevel } from '@/api/generated/models/userAccessLevel'
import { UserInfo } from '@/auth'

export function useSessionInfo() {
  const { t } = useTranslation('common')
  const userId = UserInfo.getUserId() ?? ''

  const { data: user } = useUserControllerFindById(userId, undefined, {
    query: { enabled: !!userId },
  })
  const { data: branch } = useBranchControllerFindById(user?.branchId ?? '', undefined, {
    query: { enabled: !!user?.branchId },
  })
  const { data: avatar } = useAttachmentControllerFindById(user?.avatarId ?? '', undefined, {
    query: { enabled: !!user?.avatarId },
  })

  const accessLevelLabels: Record<string, string> = Object.fromEntries(
    Object.values(UserAccessLevel).map(level => [
      level,
      t(`sessionInfo.accessLevel.${level}`),
    ]),
  )

  return {
    user,
    fullName: user?.fullName ?? UserInfo.getFullName() ?? '',
    accessLevelLabel: accessLevelLabels[user?.accessLevel ?? ''] ?? '',
    branchName: branch?.name ?? '',
    avatarUrl: avatar?.url ?? '',
  }
}
