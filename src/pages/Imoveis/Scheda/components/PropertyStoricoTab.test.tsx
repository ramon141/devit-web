import { describe, expect, it } from 'vitest'
import type { PropertyHistoryControllerHistory200 } from '@/api/generated/models'
import {
  getPropertyHistoryControllerHistoryMockHandler,
  getUserControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyStoricoTab from '@/pages/Imoveis/Scheda/components/PropertyStoricoTab'

type HistoryItem = PropertyHistoryControllerHistory200['items'][number]

const AUTHORS = ['Anna', 'Bruno', 'Carla', 'Diego', 'Elena']

function entry(index: number): HistoryItem {
  return {
    id: `h${index}`,
    occurredAt: `2026-03-1${5 - index}T10:00:00.000Z`,
    occurredAtLocal: `1${5 - index}/03/2026 11:00:00`,
    action: 'update',
    entity: 'Property',
    category: index % 2 === 0 ? 'price' : 'status',
    source: 'management',
    user: { id: `u${index}`, name: AUTHORS[index] },
    changes: [{ field: 'salePrice', previous: 100000, new: 120000 + index }],
  } as HistoryItem
}

describe('PropertyStoricoTab', () => {
  it('T143 mostra autor, data e rótulo legível de cada alteração, na ordem recebida (mais recente primeiro)', async () => {
    const items = AUTHORS.map((_, index) => entry(index))

    server.use(
      getUserControllerFindMockHandler([]),
      getPropertyHistoryControllerHistoryMockHandler({ items } as PropertyHistoryControllerHistory200),
    )

    renderFicha(<PropertyStoricoTab propertyId="p1" />)

    expect(await screen.findByText(/15\/03\/2026 11:00:00 · Anna/)).toBeInTheDocument()

    const lines = screen.getAllByText(/ · Sistema di gestione/).map((node) => node.textContent ?? '')

    expect(lines).toHaveLength(5)
    AUTHORS.forEach((author, index) => expect(lines[index]).toContain(author))
    expect(lines[0]).toContain('15/03/2026')
    expect(lines[4]).toContain('11/03/2026')

    expect(screen.getAllByText('Prezzo · Modificato').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Situazione · Modificato').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Prezzo di vendita:/).length).toBe(5)
  })

  it('T143 alteração sem autor mostra origem não indicada', async () => {
    const item = { ...entry(0), user: null }

    server.use(
      getUserControllerFindMockHandler([]),
      getPropertyHistoryControllerHistoryMockHandler({ items: [item] } as PropertyHistoryControllerHistory200),
    )

    renderFicha(<PropertyStoricoTab propertyId="p1" />)

    expect(await screen.findByText(/Origine non indicata/)).toBeInTheDocument()
  })
})
