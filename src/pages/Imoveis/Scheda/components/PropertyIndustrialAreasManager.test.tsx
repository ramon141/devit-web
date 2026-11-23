import type { DeleteInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import type { PropertyIndustrialAreaWithRelations } from '@/api/generated/models'
import {
  getPropertyIndustrialAreaControllerCreateMockHandler,
  getPropertyIndustrialAreaControllerDeleteByIdMockHandler,
  getPropertyIndustrialAreaControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyIndustrialAreasManager from '@/pages/Imoveis/Scheda/components/PropertyIndustrialAreasManager'

type AreaBody = { areaType: string; areaSqm: number | null; heightM: number | null }

async function addArea(label: string, sqm: string, height: string) {
  const user = userEvent.setup()

  await user.click(screen.getByRole('combobox'))
  await user.click(await screen.findByRole('option', { name: label }))
  await user.type(screen.getByPlaceholderText('M²'), sqm)
  await user.type(screen.getByPlaceholderText('Altezza (m)'), height)
  await user.click(screen.getByRole('button', { name: /aggiungi/i }))
}

describe('PropertyIndustrialAreasManager', () => {
  it('T142 adiciona duas áreas industriais e remove uma; a lista fica só com a restante', async () => {
    let stored: PropertyIndustrialAreaWithRelations[] = []
    const bodies: AreaBody[] = []

    server.use(
      getPropertyIndustrialAreaControllerFindMockHandler(() => stored),
      getPropertyIndustrialAreaControllerCreateMockHandler(async ({ request }) => {
        const body = (await request.json()) as AreaBody
        bodies.push(body)
        const created = { id: `a${stored.length}`, propertyId: 'p1', ...body }
        stored = [...stored, created as PropertyIndustrialAreaWithRelations]

        return created as PropertyIndustrialAreaWithRelations
      }),
      getPropertyIndustrialAreaControllerDeleteByIdMockHandler(({ params }: DeleteInfo) => {
        stored = stored.filter((item) => item.id !== params.id)

        return undefined
      }),
    )

    renderFicha(<PropertyIndustrialAreasManager propertyId="p1" />)

    await addArea('Magazzino', '300', '6')
    await screen.findByText('Magazzino · 300 m² · h 6m')
    await addArea('Uffici', '80', '3')
    await screen.findByText('Uffici · 80 m² · h 3m')

    expect(bodies).toEqual([
      { areaType: 'warehouse', areaSqm: 300, heightM: 6, propertyId: 'p1' },
      { areaType: 'office', areaSqm: 80, heightM: 3, propertyId: 'p1' },
    ])

    const row = screen.getByText('Magazzino · 300 m² · h 6m').closest('div') as HTMLElement
    await userEvent.setup().click(row.querySelector('button') as HTMLButtonElement)
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(screen.queryByText('Magazzino · 300 m² · h 6m')).not.toBeInTheDocument())
    expect(screen.getByText('Uffici · 80 m² · h 3m')).toBeInTheDocument()
  }, 60000)
})
