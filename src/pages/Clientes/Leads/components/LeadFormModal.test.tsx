import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import {
  getLeadPropertyControllerFindMockHandler,
  getUserControllerFindMockHandler,
} from '@/api/generated/api.msw'
import type { LeadPropertyWithRelations } from '@/api/generated/models'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import LeadFormModal from '@/pages/Clientes/Leads/components/LeadFormModal'
import { makeLead } from '@/pages/Clientes/Leads/leadsTestData'

const noop = () => {}

describe('Janela da solicitação: formulário', () => {
  it('T084 mostra os avisos de e-mail e telefone ao mesmo tempo e não envia', async () => {
    let created = false

    server.use(http.post('*/leads', () => {
      created = true

      return HttpResponse.json({ id: 'n1', name: 'Maria Rossi' })
    }))

    const user = userEvent.setup()

    renderWithProviders(<LeadFormModal open onOpenChange={noop} />)

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'Maria Rossi')
    await user.type(screen.getByPlaceholderText('+39 333 1234567'), 'abc')
    await user.type(document.querySelector('input[name="email"]') as HTMLElement, 'x@')
    await user.click(screen.getByRole('button', { name: /salva/i }))

    expect(await screen.findByText('E-mail non valida')).toBeInTheDocument()
    expect(screen.getByText('Numero di telefono non valido')).toBeInTheDocument()
    expect(created).toBe(false)
  })

  it('T051 bloqueia nome de 1 letra na tela', async () => {
    const user = userEvent.setup()

    renderWithProviders(<LeadFormModal open onOpenChange={noop} />)

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'A')
    await user.click(screen.getByRole('button', { name: /salva/i }))

    expect(await screen.findByText('Inserisci almeno 2 caratteri')).toBeInTheDocument()
  })

  it('T052 bloqueia o envio quando a situação é limpa', async () => {
    let created = false

    server.use(http.post('*/leads', () => {
      created = true

      return HttpResponse.json({ id: 'n1', name: 'Maria Rossi' })
    }))

    const user = userEvent.setup()

    renderWithProviders(<LeadFormModal open onOpenChange={noop} />)

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'Maria Rossi')

    // O botão de limpar é o único com tabindex -1 dentro do campo de situação
    const statusField = document.getElementById('modal-field-status')
    const clear = statusField?.querySelector('button[tabindex="-1"]')

    expect(clear).not.toBeNull()
    await user.click(clear as HTMLElement)
    await user.click(screen.getByRole('button', { name: /salva/i }))

    expect(await screen.findByText('Seleziona uno stato')).toBeInTheDocument()
    expect(created).toBe(false)
  })
})

describe('Janela da solicitação: imóveis compatíveis', () => {
  it('T075 lista exatamente os 3 imóveis devolvidos pelo servidor, na ordem recebida', async () => {
    const matches: LeadPropertyWithRelations[] = ['P1', 'P2', 'P3'].map((code) => ({
      id: `m-${code}`,
      leadId: 'l1',
      propertyId: `prop-${code}`,
      property: { code, title: `Casa ${code}` } as LeadPropertyWithRelations['property'],
    }))

    server.use(getLeadPropertyControllerFindMockHandler(matches))

    renderWithProviders(<LeadFormModal open onOpenChange={noop} lead={makeLead('l1', 'new')} />)

    const links = await screen.findAllByRole('link', { name: /Casa P/ })

    expect(links.map((link) => link.textContent)).toEqual([
      'P1 — Casa P1',
      'P2 — Casa P2',
      'P3 — Casa P3',
    ])
  })

  it('T076 mostra a mensagem de nenhum imóvel compatível quando a lista é vazia', async () => {
    server.use(getLeadPropertyControllerFindMockHandler([]))

    renderWithProviders(<LeadFormModal open onOpenChange={noop} lead={makeLead('l1', 'new')} />)

    expect(await screen.findByText('Nessun immobile compatibile al momento.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /—/ })).not.toBeInTheDocument()
  })
})

const BROKER_BASE = {
  accessLevel: 'broker',
  createdAt: '2030-01-01T00:00:00Z',
  updatedAt: '2030-01-01T00:00:00Z',
} as const

describe('Janela da solicitação: responsável', () => {
  it('T079 mostra o corretor atual e envia o novo ao trocar', async () => {
    const bodies: Record<string, string | null>[] = []

    server.use(
      getUserControllerFindMockHandler([
        { ...BROKER_BASE, id: 'u1', fullName: 'Anna Verdi', email: 'a@x.it' },
        { ...BROKER_BASE, id: 'u2', fullName: 'Bruno Neri', email: 'b@x.it' },
      ]),
      http.patch('*/leads/:id', async ({ request }) => {
        bodies.push((await request.json()) as Record<string, string | null>)

        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()
    const lead = makeLead('l1', 'new', { assignedToId: 'u1' })

    renderWithProviders(<LeadFormModal open onOpenChange={noop} lead={lead} />)

    expect(await screen.findByText('Anna Verdi')).toBeInTheDocument()

    await user.click(screen.getByText('Anna Verdi'))
    await user.click(await screen.findByRole('option', { name: 'Bruno Neri' }))
    await user.click(screen.getByRole('button', { name: /salva/i }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.assignedToId).toBe('u2')
    expect(bodies[0]?.assignedReception).toBeNull()
  })
})
