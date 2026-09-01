import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/mutator'

// `kind` ainda não existe no client gerado (orval não foi regenerado desde a
// migration). Endpoint já devolve o campo — busca crua até o próximo `api:generate`.
export type PropertyCategoryKind =
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'land'
  | 'attachment'
  | 'construction_site'

type CategoryRow = { id: string; name: string; kind?: PropertyCategoryKind | null }

export const PROPERTY_CATEGORY_KINDS: PropertyCategoryKind[] = [
  'residential',
  'commercial',
  'industrial',
  'land',
  'attachment',
  'construction_site',
]

export function useCategoryKinds() {
  const { data } = useQuery({
    queryKey: ['property-categories', 'kinds'],
    queryFn: async () => {
      const { data } = await api.get<CategoryRow[]>('/property-categories')
      return data
    },
  })

  const categories = data ?? []
  const categoryIdsByKind: Partial<Record<PropertyCategoryKind, string[]>> = {}
  for (const category of categories) {
    if (!category.kind) continue
    ;(categoryIdsByKind[category.kind] ??= []).push(category.id)
  }

  return {
    categories,
    categoryIdsByKind,
    kindsPresent: PROPERTY_CATEGORY_KINDS.filter((kind) => categoryIdsByKind[kind]?.length),
  }
}
