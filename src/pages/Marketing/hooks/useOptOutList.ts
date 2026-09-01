import { useCommunicationOptOutControllerFind } from '@/api/generated/api'

export function useOptOutList() {
  const { data: optOuts, isLoading } = useCommunicationOptOutControllerFind({
    filter: { include: ['person'], order: ['createdAt DESC'], limit: 100 },
  })

  return { optOuts: optOuts ?? [], isLoading }
}
