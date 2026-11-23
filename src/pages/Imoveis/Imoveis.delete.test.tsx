import { http, HttpResponse } from 'msw'
import { renderWithProviders, screen, userEvent, waitFor, within } from '@/test'
import { server } from '@/test/server'
import { apiError } from '@/test/apiMocks'
import type { PropertyWithRelations } from '@/api/generated/models'
import { makeRows, serveProperties } from './imoveisListHarness'
import { RouteAndToasts } from './imoveisTestFixtures'
import Imoveis from './index'

function renderList() {
  return renderWithProviders(
    <>
      <Imoveis />
      <RouteAndToasts />
    </>,
  )
}

async function clickDelete(title: string) {
  const row = (await screen.findByText(title)).closest('tr')
  const buttons = within(row as HTMLElement).getAllByRole('button')
  const trash = buttons.at(-1)

  if (!trash) throw new Error('botão excluir não encontrado')

  await userEvent.click(trash)
}

describe('Imóveis: excluir', () => {
  it('T113 pede confirmação e depois o total passa de 35 para 34', async () => {
    const rows: PropertyWithRelations[] = makeRows(35)
    const deleted: string[] = []

    serveProperties(rows)
    server.use(
      http.delete('*/properties/:id', ({ params }) => {
        const index = rows.findIndex((row) => row.id === params.id)

        deleted.push(String(params.id))
        rows.splice(index, 1)

        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderList()
    expect(await screen.findByText(/· 35 risultati/)).toBeInTheDocument()

    await clickDelete('Immobile 1')
    expect(await screen.findByText('Eliminare l\'immobile?')).toBeInTheDocument()
    expect(deleted).toHaveLength(0)

    await userEvent.click(screen.getByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText(/· 34 risultati/)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Immobile 1')).not.toBeInTheDocument())
    expect(deleted).toEqual(['p1'])
  })

  it('T114 servidor recusa (proposta aberta): mensagem aparece e imóvel permanece', async () => {
    serveProperties(makeRows(3))
    server.use(
      apiError(
        '*/properties/:id',
        409,
        { error: { statusCode: 409, message: 'Immobile con proposta aperta' } },
        'delete',
      ),
    )

    renderList()
    await clickDelete('Immobile 2')
    await userEvent.click(await screen.findByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText('Immobile con proposta aperta')).toBeInTheDocument()
    expect(screen.getByText('Immobile 2')).toBeInTheDocument()
    expect(screen.getByText(/· 3 risultati/)).toBeInTheDocument()
  })
})
