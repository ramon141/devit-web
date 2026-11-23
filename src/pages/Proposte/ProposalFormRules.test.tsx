import { describe, expect, it } from 'vitest'
import { getPurchaseProposalControllerCreateMockHandler } from '@/api/generated/api.msw'
import { screen, server, waitFor } from '@/test'
import {
  fillValidForm,
  makeProposal,
  openNewForm,
  pickOption,
  renderProposte,
  setDate,
  setupCatalogServer,
  setupProposalsServer,
  submitForm,
  typeAmount,
} from '@/pages/Proposte/proposteTestHelpers'

type SentBody = Record<string, string | number | boolean | null>

// Registra os corpos enviados ao criar proposta
function captureCreate() {
  const bodies: SentBody[] = []

  server.use(
    getPurchaseProposalControllerCreateMockHandler(async ({ request }) => {
      bodies.push((await request.json()) as SentBody)

      return makeProposal({
        id: 'new',
        number: 'PROP-0001',
        propertyId: 'prop-1',
        buyerId: 'buyer-1',
        proposalAmount: 1,
        paymentMethod: 'cash',
        proposalDate: '2026-05-10T00:00:00.000Z',
      })
    }),
  )

  return bodies
}

async function setupForm() {
  setupProposalsServer([])
  setupCatalogServer()
  renderProposte()

  return openNewForm()
}

describe('Proposte: regras do formulário', () => {
  it('T147 mostra três avisos distintos sem número, imóvel e comprador', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await typeAmount(user, '1000')
    setDate('modal-field-proposalDate', '2026-05-10')
    await submitForm(user)

    expect(await screen.findByText('Inserisci il numero')).toBeInTheDocument()
    // O mesmo texto também é o placeholder do campo: aviso + placeholder = 2
    expect(screen.getAllByText('Seleziona un immobile')).toHaveLength(2)
    expect(screen.getAllByText('Seleziona un acquirente')).toHaveLength(2)
    expect(bodies).toHaveLength(0)
  })

  it('T148 distingue valor em branco de valor zero e ignora o sinal negativo', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await submitForm(user)
    expect(await screen.findByText('Inserisci il valore della proposta')).toBeInTheDocument()

    await typeAmount(user, '0')
    await submitForm(user)
    expect(await screen.findByText('Il valore deve essere maggiore di zero')).toBeInTheDocument()

    // O campo só aceita dígitos: "-1" vira 0,01 e nunca um valor negativo
    await typeAmount(user, '-1')
    expect(screen.getByLabelText(/valore della proposta/i)).toHaveValue('0,01')
    expect(bodies).toHaveLength(0)
  })

  it('T149 envia exatamente 0,01 e 999.999.999,99', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    for (const [digits, expected] of [['1', 0.01], ['99999999999', 999999999.99]] as const) {
      await fillValidForm(user)
      await typeAmount(user, digits)
      await submitForm(user)
      await waitFor(() => expect(bodies.at(-1)?.proposalAmount).toBe(expected))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

      if (expected === 0.01) await openNewForm()
    }

    expect(bodies).toHaveLength(2)
  })

  it('T150 texto "abc" no valor não vira zero nem NaN e é recusado', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    await typeAmount(user, 'abc')

    expect(screen.getByLabelText(/valore della proposta/i)).toHaveValue('')

    await submitForm(user)

    expect(await screen.findByText('Inserisci il valore della proposta')).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })

  it('T151 recusa validade anterior à data da proposta', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    setDate('modal-field-proposalDate', '2026-05-10')
    setDate('modal-field-validUntil', '2026-05-09')
    await submitForm(user)

    expect(
      await screen.findByText('La validità non può essere anteriore alla data della proposta'),
    ).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })

  it('T152 aceita validade no mesmo dia da proposta', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    setDate('modal-field-proposalDate', '2026-05-10')
    setDate('modal-field-validUntil', '2026-05-10')
    await submitForm(user)

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(screen.queryByText(/anteriore alla data/)).not.toBeInTheDocument()
  })

  it('T153 exige motivo na recusa, em branco e só com espaços', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    await pickOption(user, 'modal-field-status', /rifiutata/i)
    await submitForm(user)
    expect(await screen.findByText('Motivo del rifiuto obbligatorio')).toBeInTheDocument()

    await user.type(document.querySelector('#modal-field-rejectionReason input') as HTMLElement, '   ')
    await submitForm(user)

    expect(await screen.findByText('Motivo del rifiuto obbligatorio')).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })

  it('T154 envia proposta recusada com o motivo informado', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    await pickOption(user, 'modal-field-status', /rifiutata/i)
    await user.type(
      document.querySelector('#modal-field-rejectionReason input') as HTMLElement,
      'valor acima do orçamento',
    )
    await submitForm(user)

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]).toMatchObject({
      status: 'rejected',
      rejectionReason: 'valor acima do orçamento',
    })
  })

  it('T155 aceita proposta aceita sem motivo de recusa', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    await pickOption(user, 'modal-field-status', /accettata/i)
    await submitForm(user)

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]).toMatchObject({ status: 'accepted', rejectionReason: null })
  })

  it('T167 exige a data da proposta e não envia nada', async () => {
    const bodies = captureCreate()
    const user = await setupForm()

    await fillValidForm(user)
    setDate('modal-field-proposalDate', '')
    await submitForm(user)

    expect(await screen.findByText('Inserisci la data')).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })
})

