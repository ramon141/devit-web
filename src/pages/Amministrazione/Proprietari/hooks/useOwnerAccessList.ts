import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/mutator'
import type { OwnerPortalAccess } from '@/pages/Amministrazione/Proprietari/types'

// Tipo local: model novo, orval ainda não regenerado contra este endpoint.
const ENDPOINT = '/owner-portal-accesses'

export function useOwnerAccessList() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['owner-portal-accesses'],
    queryFn: async () => {
      const filter = { include: [{ relation: 'person' }], order: ['createdAt DESC'] }
      const { data } = await api.get<OwnerPortalAccess[]>(ENDPOINT, { params: { filter } })
      return data
    },
  })

  return { accesses: data ?? [], isLoading, refetch }
}
