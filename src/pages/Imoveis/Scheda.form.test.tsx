import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'
import { renderWithProviders, screen, userEvent, waitFor } from '@/test'
import { server } from '@/test/server'
import { apiNetworkError } from '@/test/apiMocks'
import type { PropertyWithRelations } from '@/api/generated/models'
import { makeProperty } from './imoveisTestData'
import { RouteAndToasts } from './imoveisTestFixtures'
import PropertyScheda from './Scheda'

const ADDRESS = {
  id: 'addr-1',
  city: 'Napoli',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

type PatchBody = Record<string, string | number | boolean | null | undefined>

function renderEdit(property: PropertyWithRelations) {
  server.use(http.get('*/properties/:id', () => HttpResponse.json(property)))

  return renderWithProviders(
    <>
      <Routes>
        <Route path="/gestionale/proprieta/:id" element={<PropertyScheda />} />
        <Route path="/gestionale/proprieta/nuovo" element={<PropertyScheda />} />
      </Routes>
      <RouteAndToasts />
    </>,
    { initialEntries: [`/gestionale/proprieta/${property.id}`] },
  )
}

function capturePatches(bodies: PatchBody[]) {
  server.use(
    http.patch('*/addresses/:id', () => new HttpResponse(null, { status: 204 })),
    http.patch('*/properties/:id', async ({ request }) => {
      bodies.push((await request.json()) as PatchBody)

      return new HttpResponse(null, { status: 204 })
    }),
  )
}

const editable = (overrides: Partial<PropertyWithRelations>) =>
  makeProperty({ address: ADDRESS, ...overrides })

describe('Imóveis: formulário em etapas', () => {
  it('T116 avançar com a etapa incompleta: avisos nos campos e etapa seguinte não abre', async () => {
    renderWithProviders(<PropertyScheda />, { initialEntries: ['/gestionale/proprieta/nuovo'] })

    await userEvent.click(await screen.findByRole('button', { name: 'Avanti' }))

    expect(await screen.findByText('Inserisci il codice')).toBeInTheDocument()
    expect(screen.getByText('Inserisci almeno 3 caratteri')).toBeInTheDocument()
    expect(screen.getByText('Seleziona una categoria')).toBeInTheDocument()
    expect(screen.getAllByText('Seleziona un proprietario').length).toBeGreaterThan(0)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Codice')
    expect(screen.getByRole('tabpanel')).not.toHaveTextContent('Prezzo di vendita')
  })

  it('T115 publicar no site sem assistente automático salva e volta como foi salvo', async () => {
    const bodies: PatchBody[] = []

    capturePatches(bodies)
    renderEdit(editable({ publishedOnSite: false, useInChatbot: false }))

    await userEvent.click(await screen.findByRole('switch', { name: /sito/i }))
    await userEvent.click(screen.getByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]).toMatchObject({ publishedOnSite: true, useInChatbot: false })
  })

  it('T115 assistente automático sem publicar no site: o inverso também é independente', async () => {
    const bodies: PatchBody[] = []

    capturePatches(bodies)
    renderEdit(editable({ publishedOnSite: false, useInChatbot: false }))

    await userEvent.click(await screen.findByRole('switch', { name: /chatbot/i }))
    await userEvent.click(screen.getByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]).toMatchObject({ publishedOnSite: false, useInChatbot: true })
  })

  it('T120 falha de rede ao salvar: aviso de falha e dados digitados continuam', async () => {
    server.use(apiNetworkError('*/addresses/:id', 'patch'))
    renderEdit(editable({ title: 'Bilocale Vomero' }))

    const title = await screen.findByDisplayValue('Bilocale Vomero')

    await userEvent.type(title, ' ristrutturato')
    await userEvent.click(screen.getByRole('button', { name: 'Salva' }))

    expect(await screen.findByText(/L'API non risponde/)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Bilocale Vomero ristrutturato')).toBeInTheDocument()
  })
})
