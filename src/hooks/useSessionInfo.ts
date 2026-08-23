import {
  useAttachmentControllerFindById,
  useBranchControllerFindById,
  useUserControllerFindById,
} from '@/api/generated/api'
import { UserInfo } from '@/auth'

const accessLevelLabels: Record<string, string> = {
  admin: 'Amministratore',
  broker: 'Agente',
}

export function useSessionInfo() {
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

  return {
    user,
    fullName: user?.fullName ?? UserInfo.getFullName() ?? '',
    accessLevelLabel: accessLevelLabels[user?.accessLevel ?? ''] ?? '',
    branchName: branch?.name ?? '',
    avatarUrl: avatar?.url ?? '',
  }
}
