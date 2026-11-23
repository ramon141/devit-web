import { fireEvent, within } from '@testing-library/react'
import {
  getLeadControllerFindByIdMockHandler,
  getLeadControllerFindMockHandler,
  getLeadControllerFindResponseMock,
  getPersonControllerFindByIdMockHandler,
  getPersonControllerFindMockHandler,
  getPersonControllerFindResponseMock,
  getPropertyControllerFindByIdMockHandler,
  getPropertyControllerFindMockHandler,
  getPropertyControllerFindResponseMock,
  getPurchaseProposalControllerCountMockHandler,
  getPurchaseProposalControllerFindMockHandler,
  getPurchaseProposalControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type {
  LeadWithRelations,
  PersonWithRelations,
  PropertyWithRelations,
  PurchaseProposalWithRelations,
} from '@/api/generated/models'
import ToastViewport from '@/components/ToastViewport'
import { renderWithProviders, screen, server, userEvent } from '@/test'
import Proposte from '@/pages/Proposte'

export const PROPERTY = { id: 'prop-1', code: 'IMM-001', title: 'Villa sul mare' }
export const BUYER = { id: 'buyer-1', name: 'Mario Rossi' }

export function makeProposal(
  overrides: Partial<PurchaseProposalWithRelations> = {},
): PurchaseProposalWithRelations {
  const base: PurchaseProposalWithRelations = {
    ...(getPurchaseProposalControllerFindResponseMock()[0] as PurchaseProposalWithRelations),
    id: 'p1',
    number: 'PROP-0001',
    propertyId: PROPERTY.id,
    buyerId: BUYER.id,
    proposalAmount: 250000,
    paymentMethod: 'cash',
    status: 'received',
    financed: false,
    proposalDate: '2026-05-10T00:00:00.000Z',
    validUntil: null,
    rejectionReason: null,
    notes: null,
    leadId: null,
    sale: undefined,
    property: undefined,
    buyer: undefined,
  }

  return Object.assign({}, base, overrides)
}

export function makeProperty(
  overrides: Partial<PropertyWithRelations> = {},
): PropertyWithRelations {
  const base: PropertyWithRelations = {
    ...(getPropertyControllerFindResponseMock()[0] as PropertyWithRelations),
    ...PROPERTY,
  }

  return Object.assign({}, base, overrides)
}

export function makePerson(overrides: Partial<PersonWithRelations> = {}): PersonWithRelations {
  const base: PersonWithRelations = {
    ...(getPersonControllerFindResponseMock()[0] as PersonWithRelations),
    ...BUYER,
  }

  return Object.assign({}, base, overrides)
}

type WhereNode = { status?: string; and?: WhereNode[] }

function readJson<T>(raw: string | null): T | undefined {
  return raw ? (JSON.parse(raw) as T) : undefined
}

function statusOf(where?: WhereNode): string | undefined {
  if (!where) return undefined

  return where.status ?? where.and?.map(statusOf).find(Boolean)
}

function filterByStatus(all: PurchaseProposalWithRelations[], where?: WhereNode) {
  const status = statusOf(where)

  return status ? all.filter((proposal) => proposal.status === status) : all
}

// Lista e contagem de propostas respeitando o filtro de status enviado pela tela
export function setupProposalsServer(all: PurchaseProposalWithRelations[]) {
  server.use(
    getPurchaseProposalControllerFindMockHandler(({ request }) => {
      const filter = readJson<{ where?: WhereNode }>(new URL(request.url).searchParams.get('filter'))

      return filterByStatus(all, filter?.where)
    }),
    getPurchaseProposalControllerCountMockHandler(({ request }) => {
      const where = readJson<WhereNode>(new URL(request.url).searchParams.get('where'))

      return { count: filterByStatus(all, where).length }
    }),
  )
}

// Imóveis e pessoas disponíveis nas buscas do formulário
export function setupCatalogServer(properties = [makeProperty()], people = [makePerson()]) {
  server.use(
    getPropertyControllerFindMockHandler(({ request }) => {
      const filter = readJson<{ where?: { or?: { code?: { ilike: string } }[] } }>(
        new URL(request.url).searchParams.get('filter'),
      )
      const term = filter?.where?.or?.[0]?.code?.ilike?.replace(/%/g, '').toLowerCase()

      return properties.filter((item) => !term || item.code.toLowerCase().includes(term))
    }),
    getPersonControllerFindMockHandler(({ request }) => {
      const filter = readJson<{ where?: { name?: { ilike: string } } }>(
        new URL(request.url).searchParams.get('filter'),
      )
      const term = filter?.where?.name?.ilike?.replace(/%/g, '').toLowerCase()

      return people.filter((item) => !term || item.name.toLowerCase().includes(term))
    }),
    getPropertyControllerFindByIdMockHandler(({ params }) => {
      return properties.find((item) => item.id === params.id) ?? (properties[0] as PropertyWithRelations)
    }),
    getPersonControllerFindByIdMockHandler(({ params }) => {
      return people.find((item) => item.id === params.id) ?? (people[0] as PersonWithRelations)
    }),
  )
}

export const LEAD = { id: 'lead-1', name: 'Richiesta Verdi' }

export function setupLeadServer() {
  const lead: LeadWithRelations = { ...(getLeadControllerFindResponseMock()[0] as LeadWithRelations), ...LEAD }

  server.use(
    getLeadControllerFindMockHandler([lead]),
    getLeadControllerFindByIdMockHandler(lead),
  )
}

export function renderProposte() {
  return renderWithProviders(
    <>
      <Proposte />
      <ToastViewport />
    </>,
  )
}

export function field(id: string) {
  return within(document.getElementById(id) as HTMLElement)
}

export async function openNewForm() {
  const user = userEvent.setup()

  await user.click(await screen.findByRole('button', { name: /nuova proposta/i }))
  await screen.findByRole('dialog')

  return user
}

export async function typeAmount(user: ReturnType<typeof userEvent.setup>, digits: string) {
  const input = screen.getByLabelText(/valore della proposta/i)

  await user.clear(input)
  await user.type(input, digits)
}

export function setDate(id: string, value: string) {
  const input = document.querySelector<HTMLInputElement>(`#${id} input`) as HTMLInputElement

  fireEvent.change(input, { target: { value } })
}

export async function pickOption(
  user: ReturnType<typeof userEvent.setup>,
  triggerContainerId: string,
  optionName: RegExp | string,
) {
  const trigger = document.querySelector<HTMLElement>(`#${triggerContainerId} button`) as HTMLElement

  await user.click(trigger)
  await user.click(await screen.findByRole('option', { name: optionName }))
}

export async function pickSearchable(
  user: ReturnType<typeof userEvent.setup>,
  containerId: string,
  text: string,
) {
  const trigger = document.querySelector<HTMLElement>(`#${containerId} button`) as HTMLElement

  await user.click(trigger)
  await user.click(await screen.findByText(text))
}

// Preenche o mínimo válido para a proposta ser enviada
export async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('PROP-0001'), 'PROP-0001')
  await typeAmount(user, '25000000')
  await pickSearchable(user, 'modal-field-propertyId', `${PROPERTY.code} · ${PROPERTY.title}`)
  await pickSearchable(user, 'modal-field-buyerId', BUYER.name)
  setDate('modal-field-proposalDate', '2026-05-10')
}

export async function submitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /salva/i }))
}

// Botões de ação da linha da tabela: [converter (só aceita sem venda)], editar, excluir
export function rowButtons(number: string) {
  const row = screen.getByText(number).closest('tr') ?? screen.getByText(number).closest('div')

  return within(row as HTMLElement).getAllByRole('button')
}

export async function openEdit(number: string) {
  const user = userEvent.setup()
  await screen.findByText(number)
  const buttons = rowButtons(number)

  await user.click(buttons[buttons.length - 2] as HTMLElement)
  await screen.findByRole('dialog')

  return user
}
