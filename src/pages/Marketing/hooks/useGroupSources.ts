import {
  useAddressControllerFind,
  useLeadControllerFind,
  useLeadNeighborhoodControllerFind,
  usePersonControllerFind,
} from '@/api/generated/api'
import type { LeadWithRelations } from '@/api/generated/models'
import { normalizeText } from '@/utils/normalizeText'
import {
  onlyDigits,
  type GroupCandidate,
  type GroupKind,
  type OptedOutContacts,
} from '@/pages/Marketing/utils/leadGroup'

const GROUP_LIMIT = 500

// Rua de interesse ainda não vem da API: quando vier, o filtro passa a funcionar
type LeadWithStreet = LeadWithRelations & { interestStreet?: string | null }

export type UseRecipientGroupProps = {
  kind: GroupKind
  open: boolean
  isEmail: boolean
  optedOutPersonIds: string[]
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

type UseGroupSourcesProps = UseRecipientGroupProps & {
  neighborhoodIds: string[]
}

// Busca os leads/pessoas do grupo (filtrados por bairro) e as ruas cadastradas
export function useGroupSources({
  kind,
  open,
  optedOutPersonIds,
  neighborhoodIds,
}: UseGroupSourcesProps) {
  const hasNeighborhoods = neighborhoodIds.length > 0
  const isLead = kind === 'lead'

  const { data: links, isLoading: loadingLinks } = useLeadNeighborhoodControllerFind(
    {
      filter: {
        where: { neighborhoodId: { inq: neighborhoodIds } },
        fields: { leadId: true },
        limit: 5000,
      },
    },
    { query: { enabled: open && isLead && hasNeighborhoods } },
  )

  const { data: addresses, isLoading: loadingAddresses } = useAddressControllerFind(
    {
      filter: {
        where: { neighborhoodId: { inq: neighborhoodIds } },
        fields: { id: true },
        limit: 5000,
      },
    },
    { query: { enabled: open && !isLead && hasNeighborhoods } },
  )

  const { data: streetAddresses } = useAddressControllerFind(
    {
      filter: {
        where: {
          street: { neq: null },
          ...(hasNeighborhoods ? { neighborhoodId: { inq: neighborhoodIds } } : {}),
        },
        fields: { street: true },
        limit: 5000,
      },
    },
    { query: { enabled: open, staleTime: 5 * 60 * 1000 } },
  )

  const loadingFilter = hasNeighborhoods && (isLead ? loadingLinks : loadingAddresses)
  const linkedLeadIds = uniqueIds((links ?? []).map((link) => link.leadId))
  const addressIds = uniqueIds((addresses ?? []).map((address) => address.id ?? ''))

  const { data: leads, isLoading: loadingLeads } = useLeadControllerFind(
    {
      filter: {
        where: hasNeighborhoods ? { id: { inq: linkedLeadIds } } : {},
        fields: { id: true, name: true, email: true, phone: true },
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

  // Ruas já cadastradas no sistema (dos bairros escolhidos, se houver), sem repetição
  const streetOptions = [
    ...new Map(
      (streetAddresses ?? [])
        .map((address) => address.street?.trim() ?? '')
        .filter(Boolean)
        .map((name) => [normalizeText(name), name] as const),
    ).values(),
  ].sort((a, b) => a.localeCompare(b))

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

  return {
    candidates,
    optedOutContacts,
    streetOptions,
    isLoading: loadingFilter || (isLead ? loadingLeads : loadingPeople),
  }
}
