import { useState } from 'react'
import { usePersonControllerFind, usePersonControllerFindById } from '@/api/generated/api'
import type { PersonRole } from '@/api/generated/models'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'
import { toLikePattern } from '@/utils/toLikePattern'

// Select de pessoa (proprietário/comprador/vendedor/inquilino) sem busca no
// servidor só mostrava os primeiros 200 nomes — a maioria ficava impossível
// de encontrar. Este hook busca por nome no servidor e sempre garante que
// a pessoa já selecionada apareça nas opções, mesmo fora da busca atual.
export function usePersonSearchOptions(selectedId?: string, role?: PersonRole) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: people, isLoading } = usePersonControllerFind({
    filter: {
      where: {
        ...(role ? { role } : {}),
        ...(debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : {}),
      },
      fields: { id: true, name: true },
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

  const knownPeople =
    selectedPerson && !hasSelectedInList ? [selectedPerson, ...(people ?? [])] : (people ?? [])

  return { options, people: knownPeople, isLoading, search, setSearch }
}

// Versão para seleção múltipla: além da busca, carrega só os nomes dos já selecionados
export function usePersonSearchOptionsMulti(selectedIds: string[]) {
  const search = usePersonSearchOptions()

  const { data: selectedPeople } = usePersonControllerFind(
    { filter: { where: { id: { inq: selectedIds } }, fields: { id: true, name: true } } },
    { query: { enabled: selectedIds.length > 0 } },
  )

  const selectedOptions: SearchableSelectOption[] = (selectedPeople ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
  }))

  return { ...search, selectedOptions }
}
