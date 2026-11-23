import { describe, expect, it, vi } from 'vitest'
import type { PathParams } from 'msw'
import type { CalendarStubProps } from '@/pages/Agenda/calendarStubTypes'
import {
  getCalendarEventControllerDeleteByIdMockHandler,
  getCalendarEventControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor, within } from '@/test'
import Agenda from '@/pages/Agenda'
import { buildEvent, EVENT_DAY, renderWithToasts } from '@/pages/Agenda/agendaTestUtils'
import { addOutcome, typeTitle } from '@/pages/Agenda/agendaFormTestUtils'

// Clique em dia/evento não é possível no jsdom: o calendário vira um stub que guarda as
// propriedades, e os testes chamam dateClick/eventClick como o calendário faria.
const calendar = vi.hoisted(() => ({ props: { current: null as CalendarStubProps | null } }))

vi.mock('@fullcalendar/react', () => ({
  default: (props: CalendarStubProps) => {
    calendar.props.current = props

    return null
  },
}))

function clickDay(dateStr: string) {
  calendar.props.current?.dateClick?.({ dateStr })
}

describe('Agenda: formulário aberto pelo calendário', () => {
  // possível bug: o formulário fica montado ao fechar; clicando no mesmo dia, título e
  // resultados do evento anterior continuam preenchidos (o reset só roda se evento/data mudam)
  it.fails('T211 – fechar sem salvar e abrir um novo deixa o formulário limpo', async () => {
    renderWithToasts(<Agenda />)
    await waitFor(() => expect(calendar.props.current?.dateClick).toBeDefined())

    clickDay(EVENT_DAY)
    await screen.findByText('Nuovo impegno')
    await typeTitle('Visita antiga')
    await addOutcome('gostou')
    expect(screen.getByText('gostou')).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Annulla' }))
    await waitFor(() => expect(screen.queryByText('Nuovo impegno')).not.toBeInTheDocument())

    clickDay(EVENT_DAY)
    await screen.findByText('Nuovo impegno')

    expect(screen.getByPlaceholderText('Visita immobile con cliente')).toHaveValue('')
    expect(screen.queryByText('gostou')).not.toBeInTheDocument()
  })

  it('T212 – excluir evento pede confirmação e o evento some do calendário', async () => {
    const existing = buildEvent({ id: 'ev-del', title: 'Visita Rossi' })
    let deletedId = ''
    let deleted = false

    server.use(
      getCalendarEventControllerFindMockHandler(() => (deleted ? [] : [existing])),
      getCalendarEventControllerDeleteByIdMockHandler(({ params }: { params: PathParams }) => {
        deletedId = String(params.id)
        deleted = true
      }),
    )
    renderWithToasts(<Agenda />)
    await waitFor(() => expect(calendar.props.current?.events).toHaveLength(1))

    const arg = { event: { extendedProps: { event: existing } } }
    calendar.props.current?.eventClick?.(arg)

    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Modifica' }))
    await user.click(await screen.findByRole('button', { name: 'Elimina' }))

    const dialog = await screen.findByRole('dialog', { name: /Eliminare l'impegno/ })

    expect(deletedId).toBe('')
    await user.click(within(dialog).getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deletedId).toBe('ev-del'))
    await waitFor(() => expect(calendar.props.current?.events).toHaveLength(0))
  })
})
