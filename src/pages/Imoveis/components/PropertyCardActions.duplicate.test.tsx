import { renderWithProviders, screen, userEvent, waitFor } from '@/test'
import { server } from '@/test/server'
import { getPropertyControllerCreateMockHandler } from '@/api/generated/api.msw'
import type { PropertyWithRelations } from '@/api/generated/models'
import { apiError } from '@/test/apiMocks'
import { makeCreated, makeProperty } from '@/pages/Imoveis/imoveisTestData'
import { RouteAndToasts } from '@/pages/Imoveis/imoveisTestFixtures'
import PropertyCardActions from './PropertyCardActions'

type CreateBody = Record<string, string | number | null | undefined>

// Captura o corpo enviado na criação da cópia
function captureCreate(bodies: CreateBody[]) {
  return getPropertyControllerCreateMockHandler(async ({ request }) => {
    bodies.push((await request.json()) as CreateBody)

    return makeCreated('copy-1')
  })
}

async function duplicate(property: PropertyWithRelations) {
  renderWithProviders(
    <>
      <PropertyCardActions property={property} />
      <RouteAndToasts />
    </>,
    { initialEntries: ['/gestionale/proprieta'] },
  )

  await userEvent.click(screen.getByTitle('Duplica'))
}

describe('Imóveis: duplicar', () => {
  it('T105 preço recebido como texto vira número e leva à ficha da cópia', async () => {
    const bodies: CreateBody[] = []
    // O servidor entrega numeric como texto
    const fromServer: Partial<PropertyWithRelations> = JSON.parse(
      '{"salePrice":"835000.00","condoFee":"120.50"}',
    )

    server.use(captureCreate(bodies))
    await duplicate(makeProperty(fromServer))

    await waitFor(() => expect(screen.getByTestId('route')).toHaveTextContent('/proprieta/copy-1'))
    expect(bodies[0]?.salePrice).toBe(835000)
    expect(bodies[0]?.condoFee).toBe(120.5)
  })

  it('T106 sem preços: a cópia vai sem preço, sem 0 nem NaN', async () => {
    const bodies: CreateBody[] = []

    server.use(captureCreate(bodies))
    await duplicate(makeProperty({ salePrice: undefined }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]).not.toHaveProperty('salePrice')
    expect(bodies[0]).not.toHaveProperty('rentPrice')
    expect(bodies[0]).not.toHaveProperty('condoFee')
  })

  it('T107 código e título da cópia', async () => {
    const bodies: CreateBody[] = []

    server.use(captureCreate(bodies))
    await duplicate(makeProperty({ code: 'AP-100', title: 'Bilocale Vomero' }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.code).toBe('AP-100-COPIA')
    expect(bodies[0]?.title).toBe('Bilocale Vomero (copia)')
  })

  it('T108 servidor recusa: mostra a mensagem e permanece na lista', async () => {
    server.use(
      apiError('*/properties', 409, { error: { statusCode: 409, message: 'Codice già esistente' } }),
    )
    await duplicate(makeProperty())

    expect(await screen.findByText('Codice già esistente')).toBeInTheDocument()
    expect(screen.getByTestId('route')).toHaveTextContent('/gestionale/proprieta')
    expect(screen.getByTestId('route')).not.toHaveTextContent('copy-1')
  })
})
