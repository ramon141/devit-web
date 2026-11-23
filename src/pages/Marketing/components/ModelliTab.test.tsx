import { describe, expect, it } from 'vitest'
import {
  getCommunicationTemplateControllerCountMockHandler,
  getCommunicationTemplateControllerFindMockHandler,
  getCommunicationTemplateControllerUpdateByIdMockHandler,
} from '@/api/generated/api.msw'
import { apiError, screen, server, userEvent, waitFor, within } from '@/test'
import ModelliTab from '@/pages/Marketing/components/ModelliTab'
import { renderWithToasts } from '@/pages/Marketing/marketingRender'
import { at, makeTemplate } from '@/pages/Marketing/marketingTestData'

const template = makeTemplate({
  id: 'tpl1',
  name: 'Promo estate',
  channel: 'whatsapp',
  category: 'promozione',
  subject: null,
  body: 'Ciao {{nome}}',
  design: null,
  active: true,
})

function useTemplateList() {
  server.use(
    getCommunicationTemplateControllerFindMockHandler([template]),
    getCommunicationTemplateControllerCountMockHandler({ count: 1 }),
  )
}

async function clickRowAction(index: number) {
  const row = (await screen.findByText('Promo estate')).closest('tr')

  if (!row) throw new Error('linha do modelo não encontrada')

  await userEvent.setup().click(at(within(row).getAllByRole('button'), index))
}

describe('Marketing: lista de modelos', () => {
  it('T220 editar e salvar sem mudar nada mantém o conteúdo', async () => {
    let sentBody: Record<string, string | boolean | null> = {}

    useTemplateList()
    server.use(
      getCommunicationTemplateControllerUpdateByIdMockHandler(async ({ request }: { request: Request }) => {
        sentBody = (await request.json()) as Record<string, string | boolean | null>
      }),
    )

    renderWithToasts(<ModelliTab />)
    await clickRowAction(0)
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(screen.getByText('Modello aggiornato')).toBeInTheDocument())
    expect(sentBody).toMatchObject({
      name: 'Promo estate',
      channel: 'whatsapp',
      category: 'promozione',
      body: 'Ciao {{nome}}',
      active: true,
    })
  })

  it('T221 modelo em uso: mostra a mensagem do servidor e o modelo permanece', async () => {
    useTemplateList()
    server.use(
      apiError(
        '*/communication-templates/:id',
        409,
        { error: { statusCode: 409, message: 'Modello usato da una campagna' } },
        'delete',
      ),
    )

    renderWithToasts(<ModelliTab />)
    await clickRowAction(1)

    const dialog = await screen.findByRole('dialog')

    await userEvent.setup().click(within(dialog).getByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText('Modello usato da una campagna')).toBeInTheDocument()
    expect(screen.getByText('Promo estate')).toBeInTheDocument()
  })
})
