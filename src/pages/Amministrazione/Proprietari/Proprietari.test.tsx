import { describe, expect, it } from 'vitest'
import { HttpResponse, http } from 'msw'
import { screen, server, userEvent, waitFor, within } from '@/test'
import { renderAdmin, rowButton, rowOf } from '@/pages/Amministrazione/adminTestUtils'
import Proprietari from '@/pages/Amministrazione/Proprietari'
import type { OwnerPortalAccess } from '@/pages/Amministrazione/Proprietari/types'

const ACCESS: OwnerPortalAccess = {
  id: 'a1',
  email: 'giulia@devit.it',
  active: true,
  personId: 'p1',
  lastAccessAt: null,
  accessCount: 3,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:00:00Z',
  person: { id: 'p1', name: 'Giulia Esposito' },
  propertiesCount: 2,
}

function serveAccesses() {
  const state = { resets: 0 }

  server.use(
    http.get('*/owner-portal-accesses', () => HttpResponse.json([ACCESS])),
    http.post('*/owner-portal-accesses/a1/reset-pin', () => {
      state.resets += 1

      return HttpResponse.json({ pin: `48201${state.resets}` })
    }),
  )

  return state
}

async function resetPin() {
  await screen.findByText('Giulia Esposito')
  await userEvent.setup().click(rowButton('Giulia Esposito', 0))
}

describe('Tela de proprietários', () => {
  it('T261 gerar o código mostra o PIN com o aviso e fecha pelo botão', async () => {
    serveAccesses()
    renderAdmin(<Proprietari />)

    await resetPin()

    expect(await screen.findByText('PIN generato')).toBeInTheDocument()
    expect(screen.getByText('482011')).toBeInTheDocument()
    expect(screen.getByText('Annota il PIN adesso: non sarà più mostrato.')).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ho annotato, chiudi' }))

    await waitFor(() => expect(screen.queryByText('PIN generato')).not.toBeInTheDocument())
  })

  it('T261 depois de fechar o PIN não aparece mais em lugar nenhum da tela', async () => {
    serveAccesses()
    renderAdmin(<Proprietari />)

    await resetPin()
    await screen.findByText('482011')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ho annotato, chiudi' }))

    await waitFor(() => expect(screen.queryByText('482011')).not.toBeInTheDocument())
    expect(within(rowOf('Giulia Esposito')).queryByText(/482011/)).not.toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('482011')
  })

  it('T261 gerar de novo mostra um PIN novo, diferente do anterior', async () => {
    const state = serveAccesses()
    const user = userEvent.setup()

    renderAdmin(<Proprietari />)
    await resetPin()
    await screen.findByText('482011')
    await user.click(screen.getByRole('button', { name: 'Ho annotato, chiudi' }))
    await waitFor(() => expect(screen.queryByText('482011')).not.toBeInTheDocument())

    await user.click(rowButton('Giulia Esposito', 0))

    expect(await screen.findByText('482012')).toBeInTheDocument()
    expect(state.resets).toBe(2)
  })
})
