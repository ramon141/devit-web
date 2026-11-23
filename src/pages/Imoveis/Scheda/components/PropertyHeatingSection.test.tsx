import { describe, expect, it } from 'vitest'
import {
  getPropertyHeatingDetailControllerCreateMockHandler,
  getPropertyHeatingDetailControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import { usePropertyHeatingForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'

type SavedBody = Record<string, string | number | boolean | null>

function HeatingHarness({ onSaved }: { onSaved: () => void }) {
  const { form, onSubmit } = usePropertyHeatingForm('p1', onSaved)

  return (
    <form onSubmit={onSubmit}>
      <PropertyHeatingSection form={form} />
      <button type="submit">salvar</button>
    </form>
  )
}

describe('PropertyHeatingSection', () => {
  it('T140 salva aquecimento sem preencher nada e envia os campos como sem informação', async () => {
    let sent: SavedBody | undefined
    let saved = false

    server.use(
      getPropertyHeatingDetailControllerFindMockHandler([]),
      getPropertyHeatingDetailControllerCreateMockHandler(async ({ request }) => {
        sent = (await request.json()) as SavedBody

        return { id: 'h1', propertyId: 'p1' }
      }),
    )

    renderFicha(<HeatingHarness onSaved={() => (saved = true)} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'salvar' }))

    await waitFor(() => expect(saved).toBe(true))
    expect(sent?.propertyId).toBe('p1')
    expect(sent?.fuel ?? null).toBeNull()
    expect(sent?.system ?? null).toBeNull()
    expect(sent?.monthlyCost ?? null).toBeNull()
    expect(screen.queryByText(/errore/i)).not.toBeInTheDocument()
  })
})
