import { useState } from 'react'
import {
  useAddressControllerFind,
  useLeadControllerFind,
  useLeadNeighborhoodControllerFind,
  usePersonControllerFind,
} from '@/api/generated/api'
import type { LeadWithRelations } from '@/api/generated/models'
import {
  isContactOptedOut,
  matchesStreet,
  onlyDigits,
  partitionCandidates,
  type GroupCandidate,
  type GroupKind,
  type OptedOutContacts,
} from '@/pages/Marketing/utils/leadGroup'

const GROUP_LIMIT = 500

// Rua de interesse ainda não vem da API: quando vier, o filtro passa a funcionar
type LeadWithStreet = LeadWithRelations & { interestStreet?: string | null }

type UseRecipientGroupProps = {
  kind: GroupKind
  open: boolean
  isEmail: boolean
  optedOutPersonIds: string[]
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

export function useRecipientGroup({ kind, open, isEmail, optedOutPersonIds }: UseRecipientGroupProps) {
  const [neighborhoodIds, setNeighborhoodIds] = useState<string[]>([])
  const [street, setStreet] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [deselectedIds, setDeselectedIds] = useState<string[]>([])

  const hasNeighborhoods = neighborhoodIds.length > 0
  const isLead = kind === 'lead'

  const { data: links, isLoading: loadingLinks } = useLeadNeighborhoodControllerFind(
    { filter: { where: { neighborhoodId: { inq: neighborhoodIds } }, limit: 5000 } },
    { query: { enabled: open && isLead && hasNeighborhoods } },
  )

  const { data: addresses, isLoading: loadingAddresses } = useAddressControllerFind(
    { filter: { where: { neighborhoodId: { inq: neighborhoodIds } }, limit: 5000 } },
    { query: { enabled: open && !isLead && hasNeighborhoods } },
  )

  const loadingFilter = hasNeighborhoods && (isLead ? loadingLinks : loadingAddresses)
  const linkedLeadIds = uniqueIds((links ?? []).map((link) => link.leadId))
  const addressIds = uniqueIds((addresses ?? []).map((address) => address.id ?? ''))

  const { data: leads, isLoading: loadingLeads } = useLeadControllerFind(
    {
      filter: {
        where: hasNeighborhoods ? { id: { inq: linkedLeadIds } } : {},
        order: ['name ASC'],
        limit: GROUP_LIMIT,
      },
    },
    { query: { enabled: open && isLead && !loadingFilter } },
  )

  const { data: people, isLoading: loadingPeople } = usePersonControllerFind(
    {
      filter: {
        where: hasNeighborhoods ? { addressId: { inq: addressIds } } : {},
        include: [{ relation: 'address' }],
        order: ['name ASC'],
        limit: GROUP_LIMIT,
      },
    },
    { query: { enabled: open && !isLead && !loadingFilter } },
  )

  const { data: optedOutPeople } = usePersonControllerFind(
    { filter: { where: { id: { inq: optedOutPersonIds } } } },
    { query: { enabled: open && isLead && optedOutPersonIds.length > 0 } },
  )

  // Lead não tem vínculo com pessoa: o descadastro é cruzado pelo e-mail e telefone
  const optedOutContacts: OptedOutContacts = {
    emails: new Set((optedOutPeople ?? []).map((person) => person.email?.trim().toLowerCase() ?? '')),
    phones: new Set((optedOutPeople ?? []).map((person) => onlyDigits(person.phone ?? ''))),
  }

  const candidates: GroupCandidate[] = isLead
    ? (leads ?? []).map((lead: LeadWithStreet) => ({
        id: lead.id ?? '',
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        street: lead.interestStreet,
      }))
    : (people ?? []).map((person) => ({
        id: person.id ?? '',
        name: person.name,
        email: person.email,
        phone: person.phone,
        street: person.address?.street,
      }))

  const partition = partitionCandidates(
    candidates.filter((candidate) => matchesStreet(candidate, street)),
    isEmail,
    (candidate) =>
      isLead ? isContactOptedOut(candidate, optedOutContacts) : optedOutPersonIds.includes(candidate.id),
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
    setStreet('')
    setNameSearch('')
    setDeselectedIds([])
  }

  return {
    neighborhoodIds,
    setNeighborhoodIds,
    street,
    setStreet,
    nameSearch,
    setNameSearch,
    partition,
    selectedIds,
    toggle,
    selectAll: () => setDeselectedIds([]),
    clearAll: () => setDeselectedIds(partition.eligible.map((candidate) => candidate.id)),
    reset,
    isLoading: loadingFilter || (isLead ? loadingLeads : loadingPeople),
  }
}
