import { describe, expect, it } from 'vitest'
import { getPublicLeadControllerCreateMockHandler } from '@/api/generated/api.msw'
import ToastViewport from '@/components/ToastViewport'
import Contatti from '@/pages/Site/Contatti'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor } from '@/test'

type ContactInput = {
  name: string
  email: string
  phone: string
  message: string
  accept: boolean
}

const VALID: ContactInput = {
  name: 'Mario Rossi',
  email: 'mario@example.com',
  phone: '3331234567',
  message: 'Vorrei informazioni',
  accept: true,
}

// O ToastViewport fica no App; aqui é montado junto para ver os avisos
function renderContatti() {
  return renderWithProviders(
    <>
      <Contatti />
      <ToastViewport />
    </>,
  )
}

async function fillForm(input: ContactInput) {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Nome e cognome'), input.name)
  await user.type(screen.getByLabelText('La tua email'), input.email)
  await user.type(screen.getByLabelText('Telefono'), input.phone)
  await user.type(screen.getByLabelText('Il tuo messaggio'), input.message)

  if (input.accept) await user.click(screen.getByRole('checkbox'))

  return user
}

async function submit(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Invia' }))
}

describe('Site público: pedido de contato', () => {
  it('T281 campos abaixo do mínimo geram um aviso por campo', async () => {
    let called = false

    server.use(
      getPublicLeadControllerCreateMockHandler(() => {
        called = true

        return { id: 'x' }
      }),
    )

    renderContatti()

    const user = await fillForm({ name: 'A', email: 'x', phone: '12345', message: '1234', accept: true })

    await submit(user)

    expect(await screen.findByText('Inserisci nome e cognome')).toBeInTheDocument()
    expect(screen.getByText('Inserisci un indirizzo email valido')).toBeInTheDocument()
    expect(screen.getByText('Inserisci un numero di telefono valido')).toBeInTheDocument()
    expect(screen.getByText('Scrivi il tuo messaggio')).toBeInTheDocument()
    expect(called).toBe(false)
  })

  it('T281 limites exatos (nome 2, telefone 6, mensagem 5) são aceitos', async () => {
    const bodies: string[] = []

    server.use(
      getPublicLeadControllerCreateMockHandler(async ({ request }) => {
        bodies.push(await request.text())

        return { id: 'x' }
      }),
    )

    renderContatti()

    const user = await fillForm({
      name: 'Al',
      email: 'a@b.it',
      phone: '123456',
      message: '12345',
      accept: true,
    })

    await submit(user)

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(screen.queryByText('Inserisci nome e cognome')).not.toBeInTheDocument()
  })

  it('T282 sem aceitar os termos o pedido é recusado com aviso', async () => {
    let called = false

    server.use(
      getPublicLeadControllerCreateMockHandler(() => {
        called = true

        return { id: 'x' }
      }),
    )

    renderContatti()

    const user = await fillForm({ ...VALID, accept: false })

    await submit(user)

    expect(await screen.findByText('Devi accettare la Privacy e Cookie Policy')).toBeInTheDocument()
    expect(called).toBe(false)
  })

  it('T284 envio válido mostra agradecimento e limpa o formulário', async () => {
    let sent: Record<string, string | null> = {}

    server.use(
      getPublicLeadControllerCreateMockHandler(async ({ request }) => {
        sent = (await request.json()) as Record<string, string | null>

        return { id: 'lead-1' }
      }),
    )

    renderContatti()

    const user = await fillForm(VALID)

    await submit(user)

    expect(await screen.findByText(/Messaggio inviato con successo/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Nome e cognome')).toHaveValue(''))
    expect(screen.getByLabelText('Il tuo messaggio')).toHaveValue('')
    expect(sent.requestType).toBe('contact')
    expect(sent.name).toBe('Mario Rossi')
  })

  it('T285 falha do servidor mostra erro e mantém os dados digitados', async () => {
    server.use(apiError('*/public/leads', 500, { error: { statusCode: 500, message: 'Servizio non disponibile' } }))

    renderContatti()

    const user = await fillForm(VALID)

    await submit(user)

    expect(await screen.findByText('Servizio non disponibile')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome e cognome')).toHaveValue('Mario Rossi')
    expect(screen.getByLabelText('Il tuo messaggio')).toHaveValue('Vorrei informazioni')
  })

  it('T286 verificação contra robôs ausente: mensagem do servidor aparece e dados ficam', async () => {
    server.use(
      apiError('*/public/leads', 400, {
        error: { statusCode: 400, message: 'Verifica anti-robot mancante' },
      }),
    )

    renderContatti()

    const user = await fillForm(VALID)

    await submit(user)

    expect(await screen.findByText('Verifica anti-robot mancante')).toBeInTheDocument()
    expect(screen.getByLabelText('La tua email')).toHaveValue('mario@example.com')
    expect(screen.getByLabelText('Telefono')).toHaveValue('3331234567')
  })
})
