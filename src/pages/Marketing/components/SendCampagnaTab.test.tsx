import { describe, expect, it, vi } from 'vitest'
import {
  getAddressControllerFindMockHandler,
  getCommunicationOptOutControllerFindMockHandler,
  getMarketingCampaignControllerListMockHandler,
  getMarketingCampaignControllerSendMockHandler,
  getPersonControllerFindMockHandler,
} from '@/api/generated/api.msw'
import type {
  MarketingCampaignControllerList200Item,
  MarketingCampaignControllerSendBody,
} from '@/api/generated/models'
import { apiError, screen, server, userEvent, waitFor } from '@/test'
import SendCampagnaTab from '@/pages/Marketing/components/SendCampagnaTab'
import StoricoTab from '@/pages/Marketing/components/StoricoTab'
import { renderWithToasts } from '@/pages/Marketing/marketingRender'
import { at, makeCampaign, makePerson } from '@/pages/Marketing/marketingTestData'

// O editor de e-mail (Unlayer) carrega script externo e não roda em jsdom; os testes usam WhatsApp.
vi.mock('@/components/EmailDesignEditor', () => ({
  default: () => <div data-testid="email-editor" />,
  exportEmail: () => Promise.resolve(null),
  loadEmailDesign: () => undefined,
}))

type Backend = {
  campaigns: MarketingCampaignControllerList200Item[]
  sentBodies: MarketingCampaignControllerSendBody[]
  listCalls: number
}

function setupBackend(peopleCount: number): Backend {
  const backend: Backend = { campaigns: [], sentBodies: [], listCalls: 0 }
  const people = Array.from({ length: peopleCount }, (_, index) =>
    makePerson({ id: crypto.randomUUID(), name: `Pessoa ${index}`, phone: `3900${index}`, email: null }),
  )

  server.use(
    getPersonControllerFindMockHandler(people),
    getAddressControllerFindMockHandler([]),
    getCommunicationOptOutControllerFindMockHandler([]),
    getMarketingCampaignControllerListMockHandler(() => {
      backend.listCalls += 1

      return backend.campaigns
    }),
  )

  return backend
}

function useSendHandler(backend: Backend) {
  server.use(
    getMarketingCampaignControllerSendMockHandler(async ({ request }) => {
      const body = (await request.json()) as MarketingCampaignControllerSendBody

      backend.sentBodies.push(body)
      backend.campaigns.push(
        makeCampaign({
          campaignId: `c${backend.campaigns.length}`,
          subject: 'Promo',
          total: body.personIds.length,
        }),
      )

      return { sent: body.personIds.length, failed: 0, skipped: 0 }
    }),
  )
}

async function prepareWhatsappCampaign() {
  const user = userEvent.setup()

  renderWithToasts(
    <>
      <SendCampagnaTab />
      <StoricoTab />
    </>,
  )

  await user.click(await screen.findByRole('button', { name: /whatsapp/i }))
  await user.click(at(screen.getAllByRole('button', { name: /seleziona gruppo/i }), 0))
  await user.click(await screen.findByRole('button', { name: /aggiungi \d+ destinatari/i }))

  const textareas = screen.getAllByRole('textbox')

  await user.type(at(textareas, textareas.length - 1), 'Ciao a tutti')

  return user
}

const sendButton = () => screen.getByRole('button', { name: 'Invia' })

describe('Marketing: envio de campanha', () => {
  it('T231 envio com sucesso avisa, manda os 50 destinatários e atualiza o histórico', async () => {
    const backend = setupBackend(50)

    useSendHandler(backend)
    const user = await prepareWhatsappCampaign()
    const listCallsBefore = backend.listCalls

    await user.click(sendButton())

    expect(await screen.findByText('Inviate 50, fallite 0, saltate 0')).toBeInTheDocument()
    expect(at(backend.sentBodies, 0).personIds).toHaveLength(50)
    await waitFor(() => expect(backend.listCalls).toBeGreaterThan(listCallsBefore))
    expect(await screen.findByText('Promo')).toBeInTheDocument()
  })

  it('T232 falha do servidor mostra a mensagem e não cria campanha no histórico', async () => {
    const backend = setupBackend(50)

    server.use(
      apiError('*/marketing/campaigns/send', 500, {
        error: { statusCode: 500, message: 'Gravazione non riuscita' },
      }),
    )

    const user = await prepareWhatsappCampaign()

    await user.click(sendButton())

    expect(await screen.findByText('Gravazione non riuscita')).toBeInTheDocument()
    expect(screen.getByText('Nessuna campagna inviata')).toBeInTheDocument()
    expect(backend.campaigns).toHaveLength(0)
  })

  // possível bug: o botão só é desativado depois da re-renderização, então o 2º clique passa
  it.fails('T233 duplo clique em Enviar cria uma só campanha', async () => {
    const backend = setupBackend(5)

    useSendHandler(backend)

    const user = await prepareWhatsappCampaign()

    await user.dblClick(sendButton())
    await waitFor(() => expect(backend.sentBodies.length).toBeGreaterThan(0))
    await new Promise((resolve) => setTimeout(resolve, 300))

    expect(backend.sentBodies).toHaveLength(1)
  })

  // possível bug: o envio só exige destinatário e texto; o modelo é opcional na tela
  it.fails('T234 enviar sem escolher o modelo é bloqueado', async () => {
    const backend = setupBackend(5)

    useSendHandler(backend)

    await prepareWhatsappCampaign()

    expect(sendButton()).toBeDisabled()
  })
})
