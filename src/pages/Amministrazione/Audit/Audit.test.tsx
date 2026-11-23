import { describe, expect, it } from 'vitest'
import {
  getAuditLogControllerCountMockHandler,
  getAuditLogControllerFindMockHandler,
  getAuditLogControllerFindResponseMock,
  getUserControllerFindMockHandler,
  getUserControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { AuditLogWithRelations } from '@/api/generated/models'
import { screen, server, userEvent, waitFor, within } from '@/test'
import { renderAdmin, first } from '@/pages/Amministrazione/adminTestUtils'
import Audit from '@/pages/Amministrazione/Audit'

type AuditFilter = { skip?: number; limit?: number }

function makeLog(id: number, userId: string): AuditLogWithRelations {
  return {
    ...first(getAuditLogControllerFindResponseMock()),
    id,
    action: 'create',
    entity: 'Property',
    entityId: `entity-${id}`,
    userId,
    createdAt: '2026-03-10T10:00:00Z',
  }
}

function makeUsers() {
  const base = first(getUserControllerFindResponseMock())

  return [
    { ...base, id: 'u1', fullName: 'Mario Rossi' },
    { ...base, id: 'u2', fullName: 'Anna Neri' },
  ]
}

// Serve os registros paginados como o servidor: respeita skip e limit do filtro
function serveLogs(logs: AuditLogWithRelations[]) {
  server.use(
    getAuditLogControllerCountMockHandler({ count: logs.length }),
    getUserControllerFindMockHandler(makeUsers()),
    getAuditLogControllerFindMockHandler(({ request }) => {
      const raw = new URL(request.url).searchParams.get('filter') ?? '{}'
      const filter: AuditFilter = JSON.parse(raw)
      const skip = filter.skip ?? 0

      return logs.slice(skip, skip + (filter.limit ?? logs.length))
    }),
  )
}

function dataRows() {
  return screen.getAllByRole('row').slice(1)
}

async function goToNextPage(summary: RegExp) {
  const controls = screen.getByText(summary).parentElement

  if (!controls) throw new Error('paginação não encontrada')

  const [, next] = within(controls).getAllByRole('button')

  if (!next) throw new Error('botão de próxima página não encontrado')

  await userEvent.setup().click(next)
}

describe('Tela de auditoria', () => {
  it('T256 com 40 registros mostra 15 por página e 10 na terceira', async () => {
    const logs = Array.from({ length: 40 }, (_, index) => makeLog(index + 1, 'u1'))

    serveLogs(logs)
    renderAdmin(<Audit />)

    await screen.findByText('entity-1')
    expect(dataRows()).toHaveLength(15)
    expect(screen.getByText(/Pagina 1 di 3 · 40 risultati/)).toBeInTheDocument()

    await goToNextPage(/Pagina 1 di 3/)
    await screen.findByText('entity-16')
    expect(dataRows()).toHaveLength(15)

    await goToNextPage(/Pagina 2 di 3/)
    await screen.findByText('entity-31')
    await waitFor(() => expect(dataRows()).toHaveLength(10))
    expect(screen.getByText('entity-40')).toBeInTheDocument()
    expect(screen.queryByText('entity-1')).not.toBeInTheDocument()
  })

  it('T257 cada linha mostra o nome de quem fez a ação, não o código', async () => {
    const owners = ['u1', 'u1', 'u2', 'u2', 'u1']

    serveLogs(owners.map((userId, index) => makeLog(index + 1, userId)))
    renderAdmin(<Audit />)

    await screen.findAllByText('Anna Neri')

    const rows = dataRows()

    expect(rows).toHaveLength(5)
    expect(rows.map((row) => within(row).queryByText('Mario Rossi') ? 'Mario' : 'Anna')).toEqual([
      'Mario',
      'Mario',
      'Anna',
      'Anna',
      'Mario',
    ])
    rows.forEach((row) => {
      expect(row).not.toHaveTextContent(/\bu1\b|\bu2\b/)
    })
  })

  it('T257 sem registros mostra a mensagem de vazio', async () => {
    serveLogs([])
    renderAdmin(<Audit />)

    expect(await screen.findByText('Nessun log trovato.')).toBeInTheDocument()
  })
})
