import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import type { CalendarStubProps } from '@/pages/Agenda/calendarStubTypes'
import {
  getCalendarEventControllerFindMockHandler,
  getCalendarEventControllerUpdateByIdMockHandler,
} from '@/api/generated/api.msw'
import { apiError, screen, server, waitFor } from '@/test'
import Agenda from '@/pages/Agenda'
import { EVENT_DAY, renderWithToasts } from '@/pages/Agenda/agendaTestUtils'

// Arrastar no jsdom não é possível: o calendário é trocado por um stub que guarda as
// propriedades, e os testes chamam eventDrop/eventResize como o calendário faria.
const calendar = vi.hoisted(() => ({ props: { current: null as CalendarStubProps | null } }))

vi.mock('@fullcalendar/react', () => ({
  default: (props: CalendarStubProps) => {
    calendar.props.current = props

    return null
  },
}))

type PatchBody = { startAt?: string; endAt?: string }

function buildArg(start: string, end: string) {
  const revert = vi.fn()
  const event = { id: 'ev-1', start: dayjs(start).toDate(), end: dayjs(end).toDate() }

  return { arg: { event, revert }, revert }
}

function trackPatch() {
  const bodies: PatchBody[] = []
  let finds = 0

  server.use(
    getCalendarEventControllerFindMockHandler(() => {
      finds += 1

      return []
    }),
    getCalendarEventControllerUpdateByIdMockHandler(),
  )
  server.events.on('request:start', async ({ request }) => {
    if (request.method === 'PATCH') bodies.push((await request.clone().json()) as PatchBody)
  })

  return { bodies, getFinds: () => finds }
}

async function renderCalendar() {
  renderWithToasts(<Agenda />)
  await waitFor(() => expect(calendar.props.current?.eventDrop).toBeDefined())
}

describe('Agenda: arrastar e redimensionar eventos', () => {
  it('T203 – arrastar para o dia seguinte envia novo início e fim (90 min) e recarrega', async () => {
    const { bodies, getFinds } = trackPatch()
    await renderCalendar()
    const next = dayjs(EVENT_DAY).add(1, 'day').format('YYYY-MM-DD')
    const { arg } = buildArg(`${next}T10:00`, `${next}T11:30`)

    calendar.props.current?.eventDrop?.(arg)

    expect(await screen.findByText('Impegno spostato con successo!')).toBeInTheDocument()
    expect(bodies).toHaveLength(1)
    expect(bodies[0]?.startAt).toBe(dayjs(`${next}T10:00`).toISOString())
    expect(bodies[0]?.endAt).toBe(dayjs(`${next}T11:30`).toISOString())
    await waitFor(() => expect(getFinds()).toBeGreaterThan(1))
  })

  it('T204 – servidor recusa o arraste: mostra o erro e devolve o evento ao lugar', async () => {
    server.use(
      getCalendarEventControllerFindMockHandler([]),
      apiError(
        '*/calendar-events/:id',
        409,
        { error: { statusCode: 409, message: 'Orario non disponibile' } },
        'patch',
      ),
    )
    await renderCalendar()
    const { arg, revert } = buildArg(`${EVENT_DAY}T10:00`, `${EVENT_DAY}T11:00`)

    calendar.props.current?.eventDrop?.(arg)

    expect(await screen.findByText('Orario non disponibile')).toBeInTheDocument()
    await waitFor(() => expect(revert).toHaveBeenCalledTimes(1))
  })

  it('T205 – esticar a borda de 10:00–11:00 até 12:00 envia o novo fim', async () => {
    const { bodies } = trackPatch()
    await renderCalendar()
    const { arg } = buildArg(`${EVENT_DAY}T10:00`, `${EVENT_DAY}T12:00`)

    calendar.props.current?.eventResize?.(arg)

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.startAt).toBe(dayjs(`${EVENT_DAY}T10:00`).toISOString())
    expect(bodies[0]?.endAt).toBe(dayjs(`${EVENT_DAY}T12:00`).toISOString())
  })
})
