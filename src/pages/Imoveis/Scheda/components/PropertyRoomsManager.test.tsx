import type { DeleteInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import type { PropertyRoomWithRelations } from '@/api/generated/models'
import {
  getPropertyRoomControllerCreateMockHandler,
  getPropertyRoomControllerCreateResponseMock,
  getPropertyRoomControllerDeleteByIdMockHandler,
  getPropertyRoomControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor, within } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'

const PROPERTY_ID = 'p1'

const ROOM_LABELS: Record<string, string> = {
  kitchen: 'Cucina',
  balcony: 'Balcone',
  terrace: 'Terrazzo',
  garden: 'Giardino',
  land: 'Terreno',
  garage: 'Garage',
  covered_parking: 'Posto auto coperto',
  uncovered_parking: 'Posto auto scoperto',
  motorcycle_spot: 'Posto moto',
  camper_spot: 'Posto camper',
  boat_spot: 'Posto barca',
  cellar: 'Cantina',
  warehouse: 'Deposito',
  storage: 'Ripostiglio',
  attic: 'Soffitta',
  loft: 'Sottotetto',
  carriage_house: 'Rimessa',
  stable: 'Stalla',
  veranda: 'Veranda',
}

function room(id: string, roomType: string) {
  return { id, propertyId: PROPERTY_ID, roomType } as PropertyRoomWithRelations
}

describe('PropertyRoomsManager', () => {
  it('T127 adiciona um cômodo de cada tipo e cada um aparece com o tipo certo', async () => {
    const created: string[] = []
    let stored: PropertyRoomWithRelations[] = []

    server.use(
      getPropertyRoomControllerFindMockHandler(() => stored),
      getPropertyRoomControllerCreateMockHandler(async ({ request }) => {
        const body = (await request.json()) as { roomType: string }
        created.push(body.roomType)
        const id = `r${stored.length}`
        stored = [...stored, room(id, body.roomType)]

        return getPropertyRoomControllerCreateResponseMock({ id })
      }),
    )

    const user = userEvent.setup()
    renderFicha(<PropertyRoomsManager propertyId={PROPERTY_ID} />)

    for (const [type, label] of Object.entries(ROOM_LABELS)) {
      await user.click(screen.getAllByRole('combobox')[0] as HTMLElement)
      await user.click(await screen.findByRole('option', { name: label }))
      await user.click(screen.getByRole('button', { name: /aggiungi/i }))
      await waitFor(() => expect(created).toContain(type))
      await screen.findByText(label, { selector: 'span.text-sm' })
    }

    expect(created).toEqual(Object.keys(ROOM_LABELS))
    expect(stored).toHaveLength(Object.keys(ROOM_LABELS).length)
  }, 120000)

  it('T128 remover cômodo pede confirmação e só então remove o escolhido', async () => {
    let stored = [room('r1', 'kitchen'), room('r2', 'garage'), room('r3', 'cellar')]
    const deleted: string[] = []

    server.use(
      getPropertyRoomControllerFindMockHandler(() => stored),
      getPropertyRoomControllerDeleteByIdMockHandler(({ params }: DeleteInfo) => {
        deleted.push(String(params.id))
        stored = stored.filter((item) => item.id !== params.id)

        return undefined
      }),
    )

    const user = userEvent.setup()
    renderFicha(<PropertyRoomsManager propertyId={PROPERTY_ID} />)

    await screen.findByText('Garage')
    const row = screen.getByText('Garage').closest('div') as HTMLElement
    await user.click(within(row).getByRole('button'))

    expect(await screen.findByText('Eliminare l\'allegato?')).toBeInTheDocument()
    expect(deleted).toEqual([])

    await user.click(screen.getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deleted).toEqual(['r2']))
    await waitFor(() => expect(screen.queryByText('Garage')).not.toBeInTheDocument())
    expect(screen.getByText('Cucina')).toBeInTheDocument()
    expect(screen.getByText('Cantina')).toBeInTheDocument()
  })
})
