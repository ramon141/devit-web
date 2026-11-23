import { http, HttpResponse } from 'msw'
import { renderWithProviders, screen, userEvent, within } from '@/test'
import { server } from '@/test/server'
import { makeProperty } from '@/pages/Imoveis/imoveisTestData'
import PropertyBrokerHeader from './PropertyBrokerHeader'

function serveUsersAndCapture(posts: string[]) {
  server.use(
    http.get('*/users', () => HttpResponse.json([])),
    http.post('*/properties/:id/responsible-broker', ({ request }) => {
      posts.push(request.url)

      return new HttpResponse(null, { status: 204 })
    }),
  )
}

describe('Imóveis: transferência de corretor (tela)', () => {
  it('T112 corretor comum não vê a ação de transferir', () => {
    localStorage.setItem('accessLevel', 'broker')
    renderWithProviders(<PropertyBrokerHeader property={makeProperty()} />)

    expect(screen.queryByRole('button', { name: /Trasferisci/i })).not.toBeInTheDocument()
  })

  it('T112 T109 T111 administrador: sem corretor e com motivo curto, avisos e nada é enviado', async () => {
    const posts: string[] = []

    localStorage.setItem('accessLevel', 'ADMIN')
    serveUsersAndCapture(posts)
    renderWithProviders(<PropertyBrokerHeader property={makeProperty()} />)

    await userEvent.click(screen.getByRole('button', { name: /Trasferisci/i }))

    const dialog = await screen.findByRole('dialog')
    const reason = within(dialog).getByRole('textbox')

    await userEvent.type(reason, 'ab')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Trasferisci' }))

    expect(await screen.findByText('Seleziona il nuovo agente responsabile.')).toBeInTheDocument()
    expect(screen.getByText(/minimo 3 caratteri/)).toBeInTheDocument()

    await userEvent.clear(reason)
    await userEvent.type(reason, '   ')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Trasferisci' }))

    expect(await screen.findByText(/minimo 3 caratteri/)).toBeInTheDocument()
    expect(posts).toHaveLength(0)
  })
})
