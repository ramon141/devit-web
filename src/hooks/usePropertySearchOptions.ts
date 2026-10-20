import { useState } from 'react'
import { usePropertyControllerFind, usePropertyControllerFindById } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'
import { toLikePattern } from '@/utils/toLikePattern'

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
              { code: { ilike: toLikePattern(debouncedSearch) } },
              { title: { ilike: toLikePattern(debouncedSearch) } },
            ],
          }
        : undefined,
      fields: { id: true, code: true, title: true },
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

  const knownProperties =
    selectedProperty && !hasSelectedInList
      ? [selectedProperty, ...(properties ?? [])]
      : (properties ?? [])

  return { options, properties: knownProperties, isLoading, search, setSearch }
}
