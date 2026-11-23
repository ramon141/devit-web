import { describe, expect, it } from 'vitest'
import {
  getPublicPropertyControllerFindByIdMockHandler,
  getPublicPropertyControllerFindByIdResponseMock,
  getPublicPropertyControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { apiError, renderWithProviders, screen, server, waitFor } from '@/test'
import AppRoutes from '@/routes'

const EMPTY_LIST = { items: [], total: 0, page: 1, limit: 12 }

function mockEmptyList() {
  server.use(getPublicPropertyControllerFindMockHandler(EMPTY_LIST))
}

function buildProperty(title: string) {
  return getPublicPropertyControllerFindByIdResponseMock({
    id: 'p-1',
    slug: 'casa-bella',
    code: 'IM-100',
    title,
    purpose: 'sale',
    price: 835000,
    photos: [],
    coverPhotoUrl: null,
    zone: { slug: 'vomero', name: 'Vomero' },
  })
}

describe('Site público: rotas', () => {
  it('T276 link antigo por número do imóvel abre a ficha', async () => {
    let requestedPath = ''

    mockEmptyList()
    server.use(
      getPublicPropertyControllerFindByIdMockHandler(({ request }) => {
        requestedPath = new URL(request.url).pathname

        return buildProperty('Villa sul mare')
      }),
    )

    renderWithProviders(<AppRoutes />, { initialEntries: ['/immobile/100'] })

    expect(await screen.findByRole('heading', { name: /Villa sul mare/ })).toBeInTheDocument()
    expect(requestedPath).toBe('/public/properties/100')
  })

  it('T277 imóvel inexistente mostra tela de não encontrado', async () => {
    mockEmptyList()
    server.use(
      apiError('*/public/properties/:slug', 404, { error: { message: 'Not found' } }, 'get'),
    )

    renderWithProviders(<AppRoutes />, { initialEntries: ['/property/nao-existe'] })

    expect(await screen.findByText('Nessun immobile corrisponde a questi criteri.')).toBeInTheDocument()
  })

  it('T277 imóvel não publicado (servidor devolve vazio) mostra não encontrado', async () => {
    mockEmptyList()
    server.use(getPublicPropertyControllerFindByIdMockHandler(null as never))

    renderWithProviders(<AppRoutes />, { initialEntries: ['/property/rascunho'] })

    expect(await screen.findByText('Nessun immobile corrisponde a questi criteri.')).toBeInTheDocument()
  })

  it('T280 atalho antigo de venda vai para a lista filtrada por venda', async () => {
    const purposes: (string | null)[] = []

    server.use(
      getPublicPropertyControllerFindMockHandler(({ request }) => {
        purposes.push(new URL(request.url).searchParams.get('purpose'))

        return EMPTY_LIST
      }),
    )

    renderWithProviders(<AppRoutes />, { initialEntries: ['/vendita'] })

    await waitFor(() => expect(purposes).toContain('sale'))
  })

  it('T280 atalho antigo de aluguel vai para a lista filtrada por locação', async () => {
    const purposes: (string | null)[] = []

    server.use(
      getPublicPropertyControllerFindMockHandler(({ request }) => {
        purposes.push(new URL(request.url).searchParams.get('purpose'))

        return EMPTY_LIST
      }),
    )

    renderWithProviders(<AppRoutes />, { initialEntries: ['/affitto'] })

    await waitFor(() => expect(purposes).toContain('rent'))
  })
})
