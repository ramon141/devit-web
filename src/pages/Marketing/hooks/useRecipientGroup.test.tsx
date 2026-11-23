import { describe, expect, it } from 'vitest'
import {
  getCommunicationOptOutControllerFindMockHandler,
  getLeadControllerFindMockHandler,
  getPersonControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { renderHookWithProviders, server, waitFor } from '@/test'
import { useRecipientGroup } from '@/pages/Marketing/hooks/useRecipientGroup'
import { makeLead, makePerson } from '@/pages/Marketing/marketingTestData'
import type { LeadWithRelations, PersonWithRelations } from '@/api/generated/models'

type LeadContact = Pick<LeadWithRelations, 'id' | 'name' | 'email' | 'phone'>
type PersonContact = Pick<PersonWithRelations, 'id' | 'name' | 'email' | 'phone'>

// Lead não tem vínculo com pessoa: o descadastro vem das pessoas com id em optedOutPersonIds
function renderLeadGroup(leads: LeadContact[], optedOut: PersonContact[], isEmail: boolean) {
  server.use(
    getLeadControllerFindMockHandler(leads.map((lead) => makeLead(lead))),
    getPersonControllerFindMockHandler(optedOut.map((person) => makePerson(person))),
    getCommunicationOptOutControllerFindMockHandler([]),
  )

  return renderHookWithProviders(() =>
    useRecipientGroup({
      kind: 'lead',
      open: true,
      isEmail,
      optedOutPersonIds: optedOut.map((person) => person.id ?? ''),
    }),
  )
}

describe('Marketing: descadastro cruzado por contato (leads)', () => {
  it('T226 e-mail descadastrado com maiúsculas e espaços reconhece o lead', async () => {
    const leads = [
      { id: 'l1', name: 'Ana', email: 'ana@x.com', phone: null },
      { id: 'l2', name: 'Bia', email: 'bia@x.com', phone: null },
    ]
    const optedOut = [{ id: 'p1', name: 'Ana', email: ' Ana@X.com ', phone: null }]

    const { result } = renderLeadGroup(leads, optedOut, true)

    await waitFor(() => expect(result.current.partition.optedOut).toBe(1))
    expect(result.current.partition.eligible.map((item) => item.id)).toEqual(['l2'])
  })

  it('T227 telefone com máscara e sem máscara são o mesmo número', async () => {
    const leads = [
      { id: 'l1', name: 'Ana', email: 'a@x.com', phone: '390811234567' },
      { id: 'l2', name: 'Bia', email: 'b@x.com', phone: '390819999999' },
    ]
    const optedOut = [{ id: 'p1', name: 'Ana', email: null, phone: '+39 081-123 4567' }]

    const { result } = renderLeadGroup(leads, optedOut, false)

    await waitFor(() => expect(result.current.partition.optedOut).toBe(1))
    expect(result.current.partition.eligible.map((item) => item.id)).toEqual(['l2'])
  })

  it('T228 e-mail liberado mas telefone descadastrado: fica de fora na campanha por e-mail', async () => {
    const leads = [{ id: 'l1', name: 'Ana', email: 'livre@x.com', phone: '390811234567' }]
    const optedOut = [{ id: 'p1', name: 'Outro', email: 'outro@x.com', phone: '39 0811234567' }]

    const { result } = renderLeadGroup(leads, optedOut, true)

    await waitFor(() => expect(result.current.partition.optedOut).toBe(1))
    expect(result.current.partition.eligible).toHaveLength(0)
  })
})
