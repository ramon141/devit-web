import { useState } from 'react'
import { usePropertyControllerFind, usePropertyControllerFindById } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'

function propertyLabel(property: { code: string; title: string }) {
  return `${property.code} · ${property.title}`
}

// Select de imóvel sem busca no servidor só mostrava os primeiros 200
// (por código) — a maioria ficava impossível de encontrar, e buscar pelo
// código não achava nada (filtrava só o título). Busca por código OU
// título no servidor e sempre inclui o imóvel já selecionado.
export function usePropertySearchOptions(selectedId?: string) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: properties, isLoading } = usePropertyControllerFind({
    filter: {
      where: debouncedSearch
        ? {
            or: [
              { code: { ilike: `%${debouncedSearch}%` } },
              { title: { ilike: `%${debouncedSearch}%` } },
            ],
          }
        : undefined,
      order: ['code ASC'],
      limit: 50,
    },
  })

  const hasSelectedInList = !!selectedId && (properties ?? []).some((p) => p.id === selectedId)

  const { data: selectedProperty } = usePropertyControllerFindById(selectedId ?? '', undefined, {
    query: { enabled: !!selectedId && !hasSelectedInList },
  })

  const options: SearchableSelectOption[] = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: propertyLabel(property),
  }))

  if (selectedProperty && !hasSelectedInList) {
    options.unshift({ value: selectedProperty.id ?? '', label: propertyLabel(selectedProperty) })
  }

  return { options, isLoading, search, setSearch }
}
