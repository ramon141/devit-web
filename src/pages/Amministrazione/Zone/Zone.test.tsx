import { describe, expect, it } from 'vitest'
import {
  getNeighborhoodControllerFindMockHandler,
  getNeighborhoodControllerFindResponseMock,
  getZoneControllerCountMockHandler,
  getZoneControllerCreateMockHandler,
  getZoneControllerCreateResponseMock,
  getZoneControllerFindMockHandler,
  getZoneControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { NeighborhoodWithRelations } from '@/api/generated/models'
import type { JsonValue } from '@/test/requestBodyValidator'
import { screen, server, userEvent, waitFor } from '@/test'
import { pasteInto, readJson, renderAdmin, typeInto, first } from '@/pages/Amministrazione/adminTestUtils'
import Zone from '@/pages/Amministrazione/Zone'

type NeighborhoodFilter = { where?: { zoneId?: string } }

function zone(id: string, name: string) {
  return { ...first(getZoneControllerFindResponseMock()), id, name, city: 'Napoli', active: true }
}

function neighborhood(zoneId: string, name: string): NeighborhoodWithRelations {
  return { ...first(getNeighborhoodControllerFindResponseMock()), id: `${zoneId}-${name}`, zoneId, name }
}

const NEIGHBORHOODS = [
  neighborhood('zA', 'Chiaia'),
  neighborhood('zA', 'Posillipo Alto'),
  neighborhood('zA', 'Mergellina'),
  neighborhood('zB', 'Vomero'),
]

// Responde como o servidor: só os bairros da zona pedida no filtro
function serveNeighborhoodsByZone() {
  server.use(
    getNeighborhoodControllerFindMockHandler(({ request }) => {
      const raw = new URL(request.url).searchParams.get('filter') ?? '{}'
      const filter: NeighborhoodFilter = JSON.parse(raw)

      return NEIGHBORHOODS.filter((item) => item.zoneId === filter.where?.zoneId)
    }),
  )
}

function listZones() {
  server.use(
    getZoneControllerFindMockHandler([zone('zA', 'Zona Alfa'), zone('zB', 'Zona Beta')]),
    getZoneControllerCountMockHandler({ count: 2 }),
  )
}

describe('Tela de zonas', () => {
  it('T255 o painel mostra só os bairros da zona escolhida a cada vez', async () => {
    const user = userEvent.setup()

    listZones()
    serveNeighborhoodsByZone()
    renderAdmin(<Zone />)

    await user.click(await screen.findByRole('button', { name: 'Zona Alfa' }))

    expect(await screen.findByText('Chiaia')).toBeInTheDocument()
    expect(screen.getByText('Posillipo Alto')).toBeInTheDocument()
    expect(screen.getByText('Mergellina')).toBeInTheDocument()
    expect(screen.queryByText('Vomero')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zona Beta' }))

    expect(await screen.findByText('Vomero')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Chiaia')).not.toBeInTheDocument())
    expect(screen.queryByText('Mergellina')).not.toBeInTheDocument()
    expect(screen.getByText('Quartieri di Napoli - Zona Beta')).toBeInTheDocument()
  })

  it('T262 zona digitada com espaços é salva sem os espaços', async () => {
    const user = userEvent.setup()
    let body: JsonValue | undefined

    listZones()
    server.use(
      getZoneControllerCreateMockHandler(async ({ request }) => {
        body = await readJson(request)

        return getZoneControllerCreateResponseMock()
      }),
    )
    renderAdmin(<Zone />)

    await user.click(await screen.findByRole('button', { name: 'Nuova zona' }))
    await typeInto('Centro', '  Posillipo  ')
    await typeInto('Napoli', 'Napoli')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    expect(await screen.findByText('Zona creata con successo!')).toBeInTheDocument()
    expect(body).toMatchObject({ name: 'Posillipo', city: 'Napoli' })
  })

  it('T262 zona "  a  " é recusada por ter 1 letra e não é enviada', async () => {
    const user = userEvent.setup()

    listZones()
    renderAdmin(<Zone />)

    await user.click(await screen.findByRole('button', { name: 'Nuova zona' }))
    await typeInto('Centro', '  a  ')
    await typeInto('Napoli', 'Napoli')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    expect(await screen.findByText('Inserisci almeno 2 caratteri')).toBeInTheDocument()
    expect(screen.queryByText('Creazione della zona...')).not.toBeInTheDocument()
  })

  it('T252 zona com nome de 121 caracteres mostra o aviso de tamanho máximo', async () => {
    const user = userEvent.setup()

    listZones()
    renderAdmin(<Zone />)

    await user.click(await screen.findByRole('button', { name: 'Nuova zona' }))
    await pasteInto('Centro', 'a'.repeat(121))
    await typeInto('Napoli', 'Napoli')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    expect(await screen.findByText('Massimo 120 caratteri')).toBeInTheDocument()
  })
})
