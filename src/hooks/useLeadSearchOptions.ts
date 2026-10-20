import { useState } from 'react'
import { useLeadControllerFind, useLeadControllerFindById } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'
import { toLikePattern } from '@/utils/toLikePattern'

// Mesma estratégia de usePersonSearchOptions: busca por nome no servidor,
// poucos campos, e o lead já selecionado sempre presente nas opções
export function useLeadSearchOptions(selectedId?: string) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: leads, isLoading } = useLeadControllerFind({
    filter: {
      where: debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : undefined,
      fields: { id: true, name: true },
      order: ['name ASC'],
      limit: 50,
    },
  })

  const hasSelectedInList = !!selectedId && (leads ?? []).some((lead) => lead.id === selectedId)

  const { data: selectedLead } = useLeadControllerFindById(selectedId ?? '', undefined, {
    query: { enabled: !!selectedId && !hasSelectedInList },
  })

  const options: SearchableSelectOption[] = (leads ?? []).map((lead) => ({
    value: lead.id ?? '',
    label: lead.name,
  }))

  if (selectedLead && !hasSelectedInList) {
    options.unshift({ value: selectedLead.id ?? '', label: selectedLead.name })
  }

  return { options, isLoading, search, setSearch }
}
