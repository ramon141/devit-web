import { useState } from 'react'
import { useGroupSources, type UseRecipientGroupProps } from '@/pages/Marketing/hooks/useGroupSources'
import {
  isContactOptedOut,
  matchesStreet,
  partitionCandidates,
} from '@/pages/Marketing/utils/leadGroup'

export function useRecipientGroup(props: UseRecipientGroupProps) {
  const { kind, isEmail, optedOutPersonIds } = props
  const [neighborhoodIds, setNeighborhoodIds] = useState<string[]>([])
  const [streets, setStreets] = useState<string[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [deselectedIds, setDeselectedIds] = useState<string[]>([])
  const sources = useGroupSources({ ...props, neighborhoodIds })

  const partition = partitionCandidates(
    sources.candidates.filter((candidate) => matchesStreet(candidate, streets)),
    isEmail,
    (candidate) =>
      kind === 'lead' ? isContactOptedOut(candidate, sources.optedOutContacts) : optedOutPersonIds.includes(candidate.id),
  )

  const selectedIds = partition.eligible
    .map((candidate) => candidate.id)
    .filter((id) => !deselectedIds.includes(id))

  function toggle(id: string) {
    setDeselectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }

  function reset() {
    setNeighborhoodIds([])
    setStreets([])
    setNameSearch('')
    setDeselectedIds([])
  }

  return {
    neighborhoodIds,
    setNeighborhoodIds,
    streets,
    setStreets,
    nameSearch,
    setNameSearch,
    partition,
    selectedIds,
    toggle,
    selectAll: () => setDeselectedIds([]),
    clearAll: () => setDeselectedIds(partition.eligible.map((candidate) => candidate.id)),
    reset,
    streetOptions: sources.streetOptions,
    isLoading: sources.isLoading,
  }
}
