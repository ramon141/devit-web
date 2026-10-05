import { useState } from 'react'
import { usePersonControllerFind, usePersonControllerFindById } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'

// Select de pessoa (proprietário/comprador/vendedor/inquilino) sem busca no
// servidor só mostrava os primeiros 200 nomes — a maioria ficava impossível
// de encontrar. Este hook busca por nome no servidor e sempre garante que
// a pessoa já selecionada apareça nas opções, mesmo fora da busca atual.
export function usePersonSearchOptions(selectedId?: string) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: people, isLoading } = usePersonControllerFind({
    filter: {
      where: debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined,
      order: ['name ASC'],
      limit: 50,
    },
  })

  const hasSelectedInList = !!selectedId && (people ?? []).some((p) => p.id === selectedId)

  const { data: selectedPerson } = usePersonControllerFindById(selectedId ?? '', undefined, {
    query: { enabled: !!selectedId && !hasSelectedInList },
  })

  const options: SearchableSelectOption[] = (people ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
  }))

  if (selectedPerson && !hasSelectedInList) {
    options.unshift({ value: selectedPerson.id ?? '', label: selectedPerson.name })
  }

  return { options, isLoading, search, setSearch }
}
