import { vi } from 'vitest'
import {
  getCalendarEventControllerCreateMockHandler,
  getPersonControllerFindMockHandler,
  getPersonControllerFindResponseMock,
  getPropertyControllerFindMockHandler,
  getPropertyControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type {
  CalendarEventWithRelations,
  PersonWithRelations,
  PropertyWithRelations,
} from '@/api/generated/models'
import { screen, server, userEvent, waitFor, within } from '@/test'
import CalendarEventFormModal from '@/pages/Agenda/components/CalendarEventFormModal'
import { EVENT_DAY, renderWithToasts } from '@/pages/Agenda/agendaTestUtils'

export type CreatedEventBody = {
  title?: string
  type?: string
  reminder?: string
  recurrence?: string
  confirmationStatus?: string
  participants?: { personId: string }[]
  linkedProperties?: { propertyId: string }[]
  outcomes?: { outcome: string }[]
  attachments?: { originalName: string; mimeType: string }[]
}

type RenderFormOptions = {
  event?: CalendarEventWithRelations | null
  defaultDate?: string
}

export function renderForm({ event = null, defaultDate = EVENT_DAY }: RenderFormOptions = {}) {
  const onOpenChange = vi.fn()

  const { unmount } = renderWithToasts(
    <CalendarEventFormModal
      open
      onOpenChange={onOpenChange}
      event={event}
      defaultDate={defaultDate}
    />,
  )

  return { onOpenChange, unmount }
}

// Guarda os corpos enviados na criação; o servidor responde com sucesso
export function trackCreatedEvents() {
  const bodies: CreatedEventBody[] = []

  server.use(
    getCalendarEventControllerCreateMockHandler(async ({ request }) => {
      bodies.push((await request.clone().json()) as CreatedEventBody)

      return {
        id: 'new-ev',
        title: 'x',
        type: 'appointment',
        startAt: '',
        endAt: '',
        createdAt: '',
        updatedAt: '',
      }
    }),
  )

  return bodies
}

export function useSearchData(
  people: Pick<PersonWithRelations, 'id' | 'name'>[],
  properties: Pick<PropertyWithRelations, 'id' | 'code' | 'title'>[] = [],
) {
  server.use(
    getPersonControllerFindMockHandler(
      getPersonControllerFindResponseMock().flatMap((base) =>
        people.map((person) => ({ ...base, ...person })),
      ),
    ),
    getPropertyControllerFindMockHandler(
      getPropertyControllerFindResponseMock().flatMap((base) =>
        properties.map((item) => ({ ...base, ...item })),
      ),
    ),
  )
}

export function getField(fieldId: string) {
  const field = document.getElementById(fieldId)

  if (!field) throw new Error(`campo ${fieldId} não encontrado`)

  return field
}

export async function chooseOption(fieldId: string, optionLabel: string) {
  const user = userEvent.setup()

  await user.click(within(getField(fieldId)).getByRole('combobox'))
  await user.click(await screen.findByRole('option', { name: optionLabel }))
}

export async function typeTitle(title: string) {
  const user = userEvent.setup()

  await user.clear(screen.getByPlaceholderText('Visita immobile con cliente'))

  if (title) await user.type(screen.getByPlaceholderText('Visita immobile con cliente'), title)
}

export async function save() {
  await userEvent.setup().click(screen.getByRole('button', { name: 'Salva' }))
}

export async function waitForBodies(bodies: CreatedEventBody[], count = 1) {
  await waitFor(() => expect(bodies).toHaveLength(count))
}

// Bloco do formulário identificado pelo título ("Immobili collegati", etc.)
export function getSection(title: string) {
  const section = screen.getByText(title).parentElement

  if (!section) throw new Error(`seção ${title} não encontrada`)

  return section
}

// Escolhe um item na lista pesquisável da seção e clica em "Aggiungi"
export async function addFromSelect(sectionTitle: string, optionName: string) {
  const user = userEvent.setup()
  const section = getSection(sectionTitle)

  await user.click(within(section).getByRole('button', { name: /Seleziona/ }))
  await user.click(await screen.findByRole('option', { name: optionName }))
  await user.click(within(section).getByRole('button', { name: 'Aggiungi' }))
}

export async function addOutcome(text: string) {
  const user = userEvent.setup()
  const section = getSection('Esito dell’impegno')

  await user.type(within(section).getByRole('textbox'), text)
  await user.click(within(section).getByRole('button', { name: 'Registra esito' }))
}

// Botão de remover da linha que contém o texto
export async function removeRow(text: string) {
  const row = screen.getByText(text).closest('div')

  if (!row) throw new Error(`linha ${text} não encontrada`)

  await userEvent.setup().click(within(row).getByRole('button'))
}
