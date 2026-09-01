import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/mutator'

type PropertyFacets = { cities: string[] }

export function usePropertyFacets() {
  const { data } = useQuery({
    queryKey: ['properties', 'facets'],
    queryFn: async () => {
      const { data } = await api.get<PropertyFacets>('/properties/facets')
      return data
    },
  })

  return { cities: data?.cities ?? [] }
}
