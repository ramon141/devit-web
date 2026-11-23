import { describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router'
import type { PropertyWithRelations } from '@/api/generated/models'
import { getPropertyControllerFindByIdMockHandler } from '@/api/generated/api.msw'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import PropertyScheda from '@/pages/Imoveis/Scheda'

function renderPage(path: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/gestionale/proprieta/nuovo" element={<PropertyScheda />} />
      <Route path="/gestionale/proprieta/:id" element={<PropertyScheda />} />
    </Routes>,
    { initialEntries: [path] },
  )
}

function property(id: string, title: string) {
  return { id, title, code: `C-${id}`, purpose: 'sale', status: 'available' } as PropertyWithRelations
}

describe('Ficha do imóvel (página)', () => {
  it('T144 endereço de imóvel inexistente mostra não encontrado com volta à lista', async () => {
    server.use(
      apiError('*/properties/inexistente', 404, { error: { statusCode: 404, message: 'x' } }, 'get'),
    )

    renderPage('/gestionale/proprieta/inexistente')

    expect(await screen.findByText('Immobile non trovato.')).toBeInTheDocument()

    const back = screen.getAllByRole('link', { name: /.+/ }).filter(
      (link) => link.getAttribute('href') === '/gestionale/proprieta',
    )
    expect(back.length).toBeGreaterThanOrEqual(1)
  })

  it('T145 depois de digitar em "novo imóvel", abrir um existente mostra só os dados do existente', async () => {
    server.use(getPropertyControllerFindByIdMockHandler(property('p9', 'Casa do Lago')))
    const user = userEvent.setup()

    const first = renderPage('/gestionale/proprieta/nuovo')
    const titleInput = await screen.findByPlaceholderText('Appartamento in centro')
    await user.type(titleInput, 'Rascunho que sera descartado')
    expect(titleInput).toHaveValue('Rascunho que sera descartado')
    first.unmount()

    renderPage('/gestionale/proprieta/p9')

    await waitFor(() =>
      expect(screen.getByPlaceholderText('Appartamento in centro')).toHaveValue('Casa do Lago'),
    )
    expect(screen.queryByDisplayValue('Rascunho que sera descartado')).not.toBeInTheDocument()
  })
})
