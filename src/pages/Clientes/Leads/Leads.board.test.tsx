import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getLeadControllerFindMockHandler } from '@/api/generated/api.msw'
import type { LeadStatus, LeadWithRelations } from '@/api/generated/models'
import { renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test'
import Leads from '@/pages/Clientes/Leads'
import { makeLead } from '@/pages/Clientes/Leads/leadsTestData'

const STATUSES: NonNullable<LeadStatus>[] = [
  'new', 'contacted', 'negotiating', 'converted', 'lost',
]

function column(status: string) {
  const element = document.getElementById(`leads-column-${status}`)

  if (!element) throw new Error(`coluna ${status} não encontrada`)

  return within(element)
}

function mockLeads(leads: LeadWithRelations[]) {
  server.use(getLeadControllerFindMockHandler(leads))
}

describe('Quadro de solicitações', () => {
  it('T082 mostra cada situação com sua cor e a contagem correta', async () => {
    mockLeads([
      makeLead('1', 'new'),
      makeLead('2', 'new'),
      makeLead('3', 'contacted'),
      makeLead('4', 'lost'),
    ])
    renderWithProviders(<Leads />)

    await screen.findByText('Lead 1')

    const expected: Record<string, [string, string]> = {
      new: ['2', 'bg-sky-500'],
      contacted: ['1', 'bg-amber-500'],
      negotiating: ['0', 'bg-violet-500'],
      converted: ['0', 'bg-emerald-500'],
      lost: ['1', 'bg-red-500'],
    }

    for (const status of STATUSES) {
      const [count, color] = expected[status] ?? ['', '']
      const element = document.getElementById(`leads-column-${status}`)

      expect(element?.querySelector('span.text-xs')?.textContent).toBe(count)
      expect(element?.querySelector(`.${color}`)).not.toBeNull()
    }
  })

  it('T083 distribui 200 solicitações nas colunas certas sem cortar nem duplicar', async () => {
    const leads = Array.from({ length: 200 }, (_, index) =>
      makeLead(String(index), STATUSES[index % STATUSES.length] ?? 'new'),
    )

    mockLeads(leads)
    renderWithProviders(<Leads />)

    await screen.findByText('Lead 0')

    let total = 0

    for (const status of STATUSES) {
      const element = document.getElementById(`leads-column-${status}`)
      const count = Number(element?.querySelector('span.text-xs')?.textContent)

      expect(count).toBe(40)
      expect(element?.querySelectorAll('[aria-roledescription="draggable"]')).toHaveLength(40)
      total += count
    }

    expect(total).toBe(200)
  })

  it('T080 exclui com confirmação e a coluna passa de 3 para 2 cartões', async () => {
    let remaining = [makeLead('1', 'new'), makeLead('2', 'new'), makeLead('3', 'new')]
    let deletedId = ''

    server.use(
      http.get('*/leads', () => HttpResponse.json(remaining)),
      http.delete('*/leads/:id', ({ params }) => {
        deletedId = String(params.id)
        remaining = remaining.filter((lead) => lead.id !== deletedId)

        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()

    renderWithProviders(<Leads />)
    await screen.findByText('Lead 2')

    const card = screen.getByText('Lead 2').closest('[aria-roledescription="draggable"]')
    const buttons = within(card as HTMLElement).getAllByRole('button')

    await user.click(buttons[1] as HTMLElement)
    expect(await screen.findByText('Eliminare la richiesta?')).toBeInTheDocument()
    expect(deletedId).toBe('')

    await user.click(screen.getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(screen.queryByText('Lead 2')).not.toBeInTheDocument())
    expect(deletedId).toBe('2')
    expect(column('new').getAllByText(/^Lead /)).toHaveLength(2)
  })
})
