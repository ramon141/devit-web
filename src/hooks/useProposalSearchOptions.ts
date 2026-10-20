import { useState } from 'react'
import {
  usePurchaseProposalControllerFind,
  usePurchaseProposalControllerFindById,
} from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { SearchableSelectOption } from '@/components/SearchableSelect'
import { toLikePattern } from '@/utils/toLikePattern'

// Busca de proposta por número no servidor, mantendo a selecionada nas opções
export function useProposalSearchOptions(selectedId?: string) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: proposals, isLoading } = usePurchaseProposalControllerFind({
    filter: {
      where: debouncedSearch ? { number: { ilike: toLikePattern(debouncedSearch) } } : undefined,
      fields: { id: true, number: true },
      order: ['number ASC'],
      limit: 50,
    },
  })

  const hasSelectedInList = !!selectedId && (proposals ?? []).some((item) => item.id === selectedId)

  const { data: selectedProposal } = usePurchaseProposalControllerFindById(selectedId ?? '', undefined, {
    query: { enabled: !!selectedId && !hasSelectedInList },
  })

  const options: SearchableSelectOption[] = (proposals ?? []).map((proposal) => ({
    value: proposal.id ?? '',
    label: proposal.number,
  }))

  if (selectedProposal && !hasSelectedInList) {
    options.unshift({ value: selectedProposal.id ?? '', label: selectedProposal.number })
  }

  return { options, isLoading, search, setSearch }
}
