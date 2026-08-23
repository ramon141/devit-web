import { useCommunicationLogControllerFind } from '@/api/generated/api'

export function usePersonCommunications(personId: string) {
  const { data: logs, isLoading } = useCommunicationLogControllerFind({
    filter: { where: { personId }, order: ['sentAt DESC'] },
  })

  return { logs: logs ?? [], isLoading }
}
