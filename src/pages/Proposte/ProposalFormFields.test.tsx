import { describe, expect, it } from 'vitest'
import { getPurchaseProposalControllerCreateMockHandler } from '@/api/generated/api.msw'
import { screen, server, waitFor } from '@/test'
import {
  BUYER,
  LEAD,
  PROPERTY,
  fillValidForm,
  field,
  makePerson,
  makeProperty,
  makeProposal,
  openEdit,
  openNewForm,
  pickOption,
  pickSearchable,
  renderProposte,
  setupCatalogServer,
  setupLeadServer,
  setupProposalsServer,
  submitForm,
} from '@/pages/Proposte/proposteTestHelpers'

type SentBody = Record<string, string | number | boolean | null>

function captureCreate() {
  const bodies: SentBody[] = []

  server.use(
    getPurchaseProposalControllerCreateMockHandler(async ({ request }) => {
      bodies.push((await request.json()) as SentBody)

      return makeProposal()
    }),
  )

  return bodies
}

const PAYMENT_METHODS = [
  ['cash', 'Contanti'],
  ['financed', 'Finanziato'],
  ['direct_installments', 'Rate dirette'],
  ['exchange', 'Permuta'],
  ['other', 'Altro'],
] as const

describe('Proposte: campos do formulário', () => {
  // possível bug: proposta recusada tem o botão editar desabilitado, então o motivo
  // gravado nunca pode ser visto ao reabrir a proposta
  it.fails('T154b mostra o motivo da recusa ao reabrir a proposta', async () => {
    setupCatalogServer()
    setupProposalsServer([
      makeProposal({ status: 'rejected', rejectionReason: 'valor acima do orçamento' }),
    ])
    renderProposte()

    await openEdit('PROP-0001')

    expect(field('modal-field-rejectionReason').getByRole('textbox')).toHaveValue(
      'valor acima do orçamento',
    )
  })

  it('T156 oferece, envia e exibe cada forma de pagamento', async () => {
    const bodies = captureCreate()
    setupProposalsServer([])
    setupCatalogServer()
    renderProposte()
    let user = await openNewForm()

    for (const [value, label] of PAYMENT_METHODS) {
      await fillValidForm(user)
      await pickOption(user, 'modal-field-paymentMethod', label)
      await submitForm(user)

      await waitFor(() => expect(bodies.at(-1)?.paymentMethod).toBe(value))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      user = await openNewForm()
    }

    expect(bodies).toHaveLength(PAYMENT_METHODS.length)
  })

  it.each(PAYMENT_METHODS)('T156 exibe o rótulo de %s ao editar', async (value, label) => {
    setupCatalogServer()
    setupProposalsServer([makeProposal({ paymentMethod: value })])
    renderProposte()

    await openEdit('PROP-0001')

    expect(field('modal-field-paymentMethod').getByText(label)).toBeInTheDocument()
  })

  it('T157 busca o comprador por parte do nome e mantém a escolha ao apagar a busca', async () => {
    setupProposalsServer([])
    setupCatalogServer([makeProperty()], [makePerson(), makePerson({ id: 'b2', name: 'Luigi Bianchi' })])
    renderProposte()
    const user = await openNewForm()

    await user.click(document.querySelector('#modal-field-buyerId button') as HTMLElement)
    await user.type(screen.getByPlaceholderText('Cerca un cliente...'), 'luig')

    await waitFor(() => expect(screen.queryByText(BUYER.name)).not.toBeInTheDocument())
    await user.click(await screen.findByText('Luigi Bianchi'))

    expect(field('modal-field-buyerId').getByRole('button', { name: /acquirente/i })).toHaveTextContent(
      'Luigi Bianchi',
    )

    await user.click(document.querySelector('#modal-field-buyerId button') as HTMLElement)
    await user.type(screen.getByPlaceholderText('Cerca un cliente...'), 'x')
    await user.clear(screen.getByPlaceholderText('Cerca un cliente...'))
    await user.keyboard('{Escape}')

    expect(field('modal-field-buyerId').getByRole('button', { name: /acquirente/i })).toHaveTextContent(
      'Luigi Bianchi',
    )
  })

  it('T158 busca o imóvel pelo código e mostra código e título', async () => {
    setupProposalsServer([])
    setupCatalogServer([
      makeProperty(),
      makeProperty({ id: 'prop-2', code: 'IMM-002', title: PROPERTY.title }),
    ])
    renderProposte()
    const user = await openNewForm()

    await user.click(document.querySelector('#modal-field-propertyId button') as HTMLElement)
    await user.type(screen.getByPlaceholderText('Cerca per codice o titolo...'), 'IMM-002')

    await waitFor(() => expect(screen.queryByText(`IMM-001 · ${PROPERTY.title}`)).not.toBeInTheDocument())
    const result = await screen.findByText(`IMM-002 · ${PROPERTY.title}`)

    await user.click(result)

    expect(field('modal-field-propertyId').getByRole('button', { name: /immobile/i })).toHaveTextContent(
      'IMM-002',
    )
  })

  it('T159 vincula a solicitação e mantém o vínculo ao reabrir', async () => {
    const bodies = captureCreate()
    setupLeadServer()
    setupCatalogServer()
    setupProposalsServer([])
    renderProposte()
    const user = await openNewForm()

    await fillValidForm(user)
    await pickSearchable(user, 'modal-field-leadId', LEAD.name)
    await submitForm(user)

    await waitFor(() => expect(bodies[0]?.leadId).toBe(LEAD.id))
  })

  it('T159 mostra a solicitação vinculada ao reabrir a proposta', async () => {
    setupLeadServer()
    setupCatalogServer()
    setupProposalsServer([makeProposal({ leadId: LEAD.id })])
    renderProposte()

    await openEdit('PROP-0001')

    await waitFor(() =>
      expect(field('modal-field-leadId').getAllByRole('button')[0]).toHaveTextContent(LEAD.name),
    )
  })
})
