import { renderWithProviders, screen, userEvent, waitFor } from '@/test'
import { makeRows, serveProperties, type ListRequest } from './imoveisListHarness'
import Imoveis from './index'

type Where = { and?: { or?: { title?: { ilike: string }; code?: { ilike: string } }[] }[] }

function findRequests(requests: ListRequest[]) {
  return requests.filter((request) => request.url.pathname.endsWith('/properties'))
}

function lastFilter(requests: ListRequest[]) {
  const last = findRequests(requests).at(-1)

  return JSON.parse(last?.url.searchParams.get('filter') ?? '{}') as {
    where?: Where
    skip?: number
    limit?: number
  }
}

// Botões da paginação: [anterior, próxima]
async function clickNext(summary: RegExp) {
  const container = (await screen.findByText(summary)).parentElement
  const buttons = Array.from(container?.querySelectorAll('button') ?? [])
  const next = buttons[1]

  if (!next) throw new Error('botão próxima não encontrado')

  await userEvent.click(next)
}

describe('Imóveis: lista paginada e busca', () => {
  it('T101 35 imóveis: 4 páginas, última com 5, filtro mantido ao paginar', async () => {
    const requests = serveProperties(makeRows(35))

    renderWithProviders(<Imoveis />)
    expect(await screen.findByText('Immobile 1')).toBeInTheDocument()
    expect(screen.getByText(/Pagina 1 di 4 · 35 risultati/)).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText(/Cerca per codice/), 'Immobile')
    await waitFor(() => expect(lastFilter(requests).where).toBeDefined())

    await clickNext(/Pagina 1 di 4/)
    await clickNext(/Pagina 2 di 4/)
    await clickNext(/Pagina 3 di 4/)

    expect(await screen.findByText('Immobile 31')).toBeInTheDocument()
    expect(screen.getByText(/Pagina 4 di 4 · 35 risultati/)).toBeInTheDocument()
    expect(screen.getAllByText(/^Immobile \d+$/)).toHaveLength(5)
    expect(lastFilter(requests)).toMatchObject({ skip: 30, limit: 10 })
    expect(lastFilter(requests).where).toBeDefined()
  })

  it.each(['AP-12', 'Città'])('T103 busca por "%s" envia busca sem diferenciar maiúsculas', async (term) => {
    const requests = serveProperties(makeRows(3))

    renderWithProviders(<Imoveis />)
    await screen.findByText('Immobile 1')
    await userEvent.type(screen.getByPlaceholderText(/Cerca per codice/), term)

    await waitFor(() => {
      const conditions = lastFilter(requests).where?.and?.[0]?.or

      expect(conditions?.[0]?.title?.ilike).toBe(`%${term}%`)
      expect(conditions?.[1]?.code?.ilike).toBe(`%${term}%`)
    })
  })
})
