import type { DeleteInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import { getPersonControllerDeleteByIdMockHandler } from '@/api/generated/api.msw'
import { apiError, screen, server, userEvent, waitFor, within } from '@/test'
import Anagrafica from '@/pages/Clientes/Anagrafica'
import { makePerson, mockPeopleList } from '@/pages/Clientes/clientesApiMocks'
import { renderWithToasts } from '@/pages/Clientes/clientesTestUtils'

const SEARCH_PLACEHOLDER = 'Cerca un cliente per nome...'

function makeMany(total: number) {
  return Array.from({ length: total }, (_, index) =>
    makePerson({ id: `p${index + 1}`, name: `Cliente ${index + 1}`, role: 'owner' }),
  )
}

function paginationButtons(summary: RegExp) {
  const container = screen.getByText(summary).parentElement as HTMLElement

  const [previous, next] = within(container).getAllByRole('button')

  if (!previous || !next) throw new Error('Botões de paginação ausentes')

  return [previous, next] as const
}

describe('Clientes - busca, lista e exclusão', () => {
  it('T041 digitar rápido faz uma única consulta com o texto final', async () => {
    const searches: string[] = []

    mockPeopleList([makePerson({ id: 'p1', name: 'Mario Bianchi' })], (filter) => {
      const ilike = filter.where?.name

      if (typeof ilike === 'object' && !Array.isArray(ilike)) searches.push(ilike.ilike ?? '')
    })
    renderWithToasts(<Anagrafica />)

    await screen.findByText('Mario Bianchi')

    const user = userEvent.setup({ delay: 100 })

    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), 'mario')

    await waitFor(() => expect(searches).toEqual(['%mario%']))
    expect(screen.getByText('Mario Bianchi')).toBeInTheDocument()
  })

  it('T042 a busca envia o texto como digitado e mostra a pessoa devolvida', async () => {
    const searches: string[] = []

    mockPeopleList([makePerson({ id: 'p1', name: 'José' })], (filter) => {
      const ilike = filter.where?.name

      if (typeof ilike === 'object' && !Array.isArray(ilike)) searches.push(ilike.ilike ?? '')
    })
    renderWithToasts(<Anagrafica />)

    const user = userEvent.setup()
    const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)

    for (const term of ['JOSE', 'jose', 'José']) {
      await user.clear(input)
      await user.type(input, term)
      await waitFor(() => expect(searches).toContain(`%${term}%`))
      expect(await screen.findByText('José')).toBeInTheDocument()
    }
  })

  it('T043 % e _ são tratados como letras comuns', async () => {
    const searches: string[] = []

    mockPeopleList(makeMany(2), (filter) => {
      const ilike = filter.where?.name

      if (typeof ilike === 'object' && !Array.isArray(ilike)) searches.push(ilike.ilike ?? '')
    })
    renderWithToasts(<Anagrafica />)

    const user = userEvent.setup()
    const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)

    await user.type(input, '%')
    await waitFor(() => expect(searches).toContain('%\\%%'))

    await user.clear(input)
    await user.type(input, '_')
    await waitFor(() => expect(searches).toContain('%\\_%'))
  })

  it('T044 25 pessoas: 3 páginas e a busca volta para a página 1', async () => {
    mockPeopleList(makeMany(25))
    renderWithToasts(<Anagrafica />)

    await screen.findByText('Cliente 1')

    const user = userEvent.setup()
    const [, next] = paginationButtons(/Pagina 1 di 3/)

    await user.click(next)
    await screen.findByText(/Pagina 2 di 3/)
    await user.click(paginationButtons(/Pagina 2 di 3/)[1])
    await screen.findByText(/Pagina 3 di 3/)
    expect(await screen.findByText('Cliente 25')).toBeInTheDocument()
    expect(screen.queryByText('Cliente 26')).not.toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(1 + 5)

    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), 'x')
    expect(await screen.findByText(/Pagina 1 di/)).toBeInTheDocument()
  })

  it('T045 lista vazia mostra a mensagem de lista vazia', async () => {
    mockPeopleList([])
    renderWithToasts(<Anagrafica />)

    expect(await screen.findByText('Nessun cliente trovato.')).toBeInTheDocument()
  })

  it('T046 cancelar não exclui; confirmar exclui e avisa', async () => {
    const deleted: string[] = []

    mockPeopleList([makePerson({ id: 'p1', name: 'Mario Rossi', role: 'owner' })])
    server.use(
      getPersonControllerDeleteByIdMockHandler(({ params }: DeleteInfo) => {
        deleted.push(String(params.id))
      }),
    )
    renderWithToasts(<Anagrafica />)

    const user = userEvent.setup()
    const row = (await screen.findByText('Mario Rossi')).closest('tr') as HTMLElement
    const trash = within(row).getAllByRole('button')[2] as HTMLElement

    await user.click(trash)
    await user.click(await screen.findByRole('button', { name: 'Annulla' }))
    expect(deleted).toEqual([])

    await user.click(trash)
    await user.click(await screen.findByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deleted).toEqual(['p1']))
    expect(await screen.findByText('Cliente eliminato con successo!')).toBeInTheDocument()
  })

  it('T047 exclusão recusada mostra a mensagem do servidor e mantém a pessoa', async () => {
    mockPeopleList([makePerson({ id: 'p1', name: 'Mario Rossi', role: 'owner' })])
    server.use(
      apiError(
        '*/people/:id',
        409,
        { error: { statusCode: 409, message: 'Cliente collegato a un immobile' } },
        'delete',
      ),
    )
    renderWithToasts(<Anagrafica />)

    const user = userEvent.setup()
    const row = (await screen.findByText('Mario Rossi')).closest('tr') as HTMLElement

    await user.click(within(row).getAllByRole('button')[2] as HTMLElement)
    await user.click(await screen.findByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText('Cliente collegato a un immobile')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })
})

