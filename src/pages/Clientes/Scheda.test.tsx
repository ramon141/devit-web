import { describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router'
import {
  getCalendarEventParticipantControllerFindMockHandler,
  getCommunicationLogControllerFindMockHandler,
  getPersonAttachmentControllerFindMockHandler,
  getPersonControllerFindByIdMockHandler,
  getPropertyControllerFindMockHandler,
  getPropertyOwnerControllerFindMockHandler,
  getPurchaseProposalBuyerControllerFindMockHandler,
  getPurchaseProposalControllerFindMockHandler,
  getRentalContractControllerFindMockHandler,
  getRentalContractTenantControllerFindMockHandler,
  getSaleBuyerControllerFindMockHandler,
  getSaleControllerFindMockHandler,
  getSaleSellerControllerFindMockHandler,
} from '@/api/generated/api.msw'
import type {
  CalendarEventParticipantWithRelations,
  CommunicationLogWithRelations,
  PersonAttachmentWithRelations,
} from '@/api/generated/models'
import { apiError, screen, server, userEvent } from '@/test'
import Scheda from '@/pages/Clientes/Scheda'
import { makePerson, readFilter } from '@/pages/Clientes/clientesApiMocks'
import { renderWithToasts } from '@/pages/Clientes/clientesTestUtils'

const PERSON_ID = 'p1'

function renderScheda(id: string) {
  renderWithToasts(
    <Routes>
      <Route path="/gestionale/clienti/:id" element={<Scheda />} />
    </Routes>,
    [`/gestionale/clienti/${id}`],
  )
}

// Fontes de imóveis/vínculos da pessoa, todas vazias
function mockEmptyProperties() {
  server.use(
    getPropertyOwnerControllerFindMockHandler([]),
    getRentalContractTenantControllerFindMockHandler([]),
    getSaleBuyerControllerFindMockHandler([]),
    getSaleSellerControllerFindMockHandler([]),
    getPurchaseProposalBuyerControllerFindMockHandler([]),
    getPropertyControllerFindMockHandler([]),
    getRentalContractControllerFindMockHandler([]),
    getSaleControllerFindMockHandler([]),
    getPurchaseProposalControllerFindMockHandler([]),
  )
}

describe('Clientes - ficha da pessoa', () => {
  it('T048 pessoa inexistente mostra "não encontrado" com volta para a lista', async () => {
    server.use(
      apiError('*/people/:id', 404, { error: { statusCode: 404, message: 'Not found' } }, 'get'),
    )
    renderScheda('inexistente')

    expect(await screen.findByText('Cliente non trovato.')).toBeInTheDocument()

    const links = screen.getAllByRole('link', { name: 'Clienti' })

    expect(links.length).toBeGreaterThan(0)

    for (const link of links) {
      expect(link).toHaveAttribute('href', '/gestionale/clienti')
    }
  })

  it('T049 cada aba mostra só os dados da pessoa e a vazia mostra mensagem', async () => {
    const requestedPeople = new Set<string>()

    function onlyThisPerson<T>(rows: T[]) {
      return ({ request }: { request: Request }) => {
        const filter = readFilter(request.url)
        const personId = String(filter.where?.personId)

        requestedPeople.add(personId)

        return personId === PERSON_ID ? rows : []
      }
    }

    server.use(
      getPersonControllerFindByIdMockHandler(
        makePerson({ id: PERSON_ID, name: 'Mario Rossi', role: 'owner' }),
      ),
      getCalendarEventParticipantControllerFindMockHandler(
        onlyThisPerson<CalendarEventParticipantWithRelations>([
          {
            id: 'e1',
            calendarEventId: 'c1',
            personId: PERSON_ID,
            createdAt: '2030-01-01T00:00:00Z',
            updatedAt: '2030-01-01T00:00:00Z',
            calendarEvent: {
              id: 'c1',
              title: 'Visita Via Roma',
              type: 'appointment',
              startAt: '2030-05-10T10:00:00Z',
              endAt: '2030-05-10T11:00:00Z',
              createdAt: '2030-01-01T00:00:00Z',
              updatedAt: '2030-01-01T00:00:00Z',
            },
          },
        ]),
      ),
      getCommunicationLogControllerFindMockHandler(onlyThisPerson<CommunicationLogWithRelations>([])),
      getPersonAttachmentControllerFindMockHandler(onlyThisPerson<PersonAttachmentWithRelations>([])),
    )
    mockEmptyProperties()
    renderScheda(PERSON_ID)

    const user = userEvent.setup()

    await screen.findByRole('tab', { name: 'Dati' })

    await user.click(screen.getByRole('tab', { name: 'Agenda' }))
    expect(await screen.findByText('Visita Via Roma')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Immobili' }))
    expect(await screen.findByText('Nessun immobile collegato.')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Comunicazioni' }))
    expect(await screen.findByText('Nessuna comunicazione registrata.')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Allegati' }))
    expect(await screen.findByText('Nessun allegato.')).toBeInTheDocument()

    expect([...requestedPeople]).toEqual([PERSON_ID])
  })
})
