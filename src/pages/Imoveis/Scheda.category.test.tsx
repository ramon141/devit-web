import { http, HttpResponse } from 'msw'
import { renderWithProviders, screen, userEvent } from '@/test'
import { server } from '@/test/server'
import PropertyScheda from './Scheda'

const TITLE_PLACEHOLDER = 'Appartamento in centro'

const CATEGORIES = [
  { id: 'cat-1', name: 'Appartamento', slug: 'appartamento', kind: 'residential', active: true },
  { id: 'cat-2', name: 'Terreno edificabile', slug: 'terreno', kind: 'land', active: true },
]

describe('Imóveis: troca de categoria no cadastro', () => {
  it('T117 trocar a categoria não apaga o que já foi digitado nos campos comuns', async () => {
    server.use(http.get('*/property-categories', () => HttpResponse.json(CATEGORIES)))
    const { container } = renderWithProviders(<PropertyScheda />, { initialEntries: ['/gestionale/proprieta/nuovo?categoryId=cat-1'] })

    const title = await screen.findByPlaceholderText(TITLE_PLACEHOLDER)

    await userEvent.type(title, 'Casa vista mare')

    const trigger = container.querySelector<HTMLElement>('#property-field-categoryId button')

    if (!trigger) throw new Error('campo categoria não encontrado')

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Terreno edificabile' }))

    expect(screen.getByDisplayValue('Casa vista mare')).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Terreno edificabile')
  })
})
