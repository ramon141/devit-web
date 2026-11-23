import type { DeleteInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import type { PropertyFeatureWithRelations } from '@/api/generated/models'
import {
  getPropertyFeatureControllerCreateMockHandler,
  getPropertyFeatureControllerDeleteByIdMockHandler,
  getPropertyFeatureControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'

const OPTIONS = [
  { key: 'balcony', label: 'Balcone' },
  { key: 'elevator', label: 'Ascensore' },
  { key: 'pool', label: 'Piscina' },
]

function feature(id: string, featureKey: string) {
  return { id, propertyId: 'p1', category: 'amenity', featureKey } as PropertyFeatureWithRelations
}

function checkbox(label: string) {
  return screen.getByRole('checkbox', { name: label })
}

describe('PropertyFeaturesSection', () => {
  it('T139 marca e desmarca características e o estado reflete exatamente o que o servidor guarda', async () => {
    let stored: PropertyFeatureWithRelations[] = []

    server.use(
      getPropertyFeatureControllerFindMockHandler(() => stored),
      getPropertyFeatureControllerCreateMockHandler(async ({ request }) => {
        const body = (await request.json()) as { featureKey: string }
        const created = feature(`f-${body.featureKey}`, body.featureKey)
        stored = [...stored, created]

        return created
      }),
      getPropertyFeatureControllerDeleteByIdMockHandler(({ params }: DeleteInfo) => {
        stored = stored.filter((item) => item.id !== params.id)

        return undefined
      }),
    )

    const user = userEvent.setup()

    renderFicha(
      <PropertyFeaturesSection propertyId="p1" category="amenity" title="Extras" options={OPTIONS} />,
    )

    for (const option of OPTIONS) {
      await user.click(checkbox(option.label))
      await waitFor(() => expect(checkbox(option.label)).toBeChecked())
    }

    expect(stored.map((item) => item.featureKey)).toEqual(['balcony', 'elevator', 'pool'])

    await user.click(checkbox('Balcone'))

    await waitFor(() => expect(checkbox('Balcone')).not.toBeChecked())
    expect(checkbox('Ascensore')).toBeChecked()
    expect(checkbox('Piscina')).toBeChecked()
    expect(stored.map((item) => item.featureKey)).toEqual(['elevator', 'pool'])
  })
})
