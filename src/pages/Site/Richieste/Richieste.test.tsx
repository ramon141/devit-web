import { describe, expect, it } from 'vitest'
import { getPublicLeadControllerCreateMockHandler } from '@/api/generated/api.msw'
import ToastViewport from '@/components/ToastViewport'
import Richieste from '@/pages/Site/Richieste'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'

type LeadBody = Record<string, string | number | null | undefined>

const BUDGET_ERROR = 'Inserisci un budget valido maggiore di zero'

// O ToastViewport fica no App; aqui é montado junto para ver os avisos
function renderRichieste() {
  return renderWithProviders(
    <>
      <Richieste />
      <ToastViewport />
    </>,
  )
}

async function fillBase(budget: string) {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText("Città dell'immobile"), 'Napoli')

  if (budget) await user.type(screen.getByLabelText('Prezzo max'), budget)

  await user.type(screen.getByLabelText('Nome e cognome'), 'Mario Rossi')
  await user.type(screen.getByLabelText('Email'), 'mario@example.com')
  await user.type(screen.getByLabelText('Contatto telefonico'), '3331234567')
  await user.type(screen.getByLabelText('Messaggio'), 'Cerco casa')
  await user.click(screen.getByRole('checkbox'))

  return user
}

function captureBodies() {
  const bodies: LeadBody[] = []

  server.use(
    getPublicLeadControllerCreateMockHandler(async ({ request }) => {
      bodies.push((await request.json()) as LeadBody)

      return { id: 'lead-1' }
    }),
  )

  return bodies
}

describe('Site público: pedido de busca e avaliação', () => {
  it('T283 orçamento 0 e negativo são recusados no pedido de busca', async () => {
    const bodies = captureBodies()

    for (const budget of ['0', '-5']) {
      const { unmount } = renderRichieste()
      const user = await fillBase(budget)

      await user.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

      expect(await screen.findByText(BUDGET_ERROR)).toBeInTheDocument()
      unmount()
    }

    expect(bodies).toHaveLength(0)
  })

  it('T283 texto "abc" não entra no campo numérico e o pedido segue sem orçamento', async () => {
    const bodies = captureBodies()

    renderRichieste()

    const user = await fillBase('abc')

    expect(screen.getByLabelText('Prezzo max')).toHaveValue(null)

    await user.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.maxBudget).toBeUndefined()
  })

  it('T283 no pedido de avaliação o orçamento inválido é ignorado', async () => {
    const bodies = captureBodies()

    renderRichieste()

    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Prezzo max'), '-5')
    await user.click(screen.getByRole('button', { name: 'Valutazione proprietà' }))

    expect(screen.queryByLabelText('Prezzo max')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText("Città dell'immobile"), 'Napoli')
    await user.type(screen.getByLabelText('Nome e cognome'), 'Mario Rossi')
    await user.type(screen.getByLabelText('Email'), 'mario@example.com')
    await user.type(screen.getByLabelText('Contatto telefonico'), '3331234567')
    await user.type(screen.getByLabelText('Messaggio'), 'Valutate la mia casa')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(screen.queryByText(BUDGET_ERROR)).not.toBeInTheDocument()
    expect(bodies[0]?.requestType).toBe('valuation')
    expect(bodies[0]?.maxBudget).toBeUndefined()
  })

  it('T283 orçamento válido é enviado como número', async () => {
    const bodies = captureBodies()

    renderRichieste()

    const user = await fillBase('250000')

    await user.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.maxBudget).toBe(250000)
    expect(bodies[0]?.requestType).toBe('search')
  })
})
