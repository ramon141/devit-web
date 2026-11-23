import type { PatchInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import {
  getAddressControllerCreateMockHandler,
  getAddressControllerCreateResponseMock,
  getPersonControllerCreateMockHandler,
  getPersonControllerCreateResponseMock,
  getPersonControllerUpdateByIdMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor, within } from '@/test'
import Anagrafica from '@/pages/Clientes/Anagrafica'
import { makePerson, mockPeopleList } from '@/pages/Clientes/clientesApiMocks'
import { renderWithToasts } from '@/pages/Clientes/clientesTestUtils'

type Body = Record<string, string | boolean | null | undefined>

async function openNewForm() {
  const user = userEvent.setup()

  renderWithToasts(<Anagrafica />)
  await user.click(await screen.findByRole('button', { name: /Nuovo cliente/ }))
  await screen.findByPlaceholderText('Mario Rossi')

  return user
}

function captureCreates() {
  const bodies = { person: undefined as Body | undefined, address: undefined as Body | undefined }

  server.use(
    getPersonControllerCreateMockHandler(async ({ request }) => {
      bodies.person = (await request.json()) as Body

      return getPersonControllerCreateResponseMock()
    }),
    getAddressControllerCreateMockHandler(async ({ request }) => {
      bodies.address = (await request.json()) as Body

      return getAddressControllerCreateResponseMock({ id: 'addr-1' })
    }),
  )

  return bodies
}

describe('Clientes - formulário de pessoa', () => {
  it('T036 rua sem cidade mostra o aviso no campo cidade e não envia', async () => {
    mockPeopleList([])

    const bodies = captureCreates()
    const user = await openNewForm()

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'Mario Rossi')
    await user.type(screen.getByPlaceholderText('Via Roma'), 'Via Roma')
    await user.type(screen.getByPlaceholderText('12'), '12')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    const cityField = (await screen.findByPlaceholderText('Milano')).closest('div') as HTMLElement
    const message = "Inserisci la città per salvare l'indirizzo"

    expect(await within(cityField.parentElement as HTMLElement).findByText(message)).toBeVisible()
    expect(bodies.person).toBeUndefined()
  })

  it('T037 só a cidade preenchida cria o cadastro com os demais campos vazios', async () => {
    mockPeopleList([])

    const bodies = captureCreates()
    const user = await openNewForm()

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'Mario Rossi')
    await user.type(screen.getByPlaceholderText('Milano'), 'Napoli')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(bodies.person).toBeDefined())
    expect(bodies.address).toEqual({ city: 'Napoli' })
    expect(bodies.person?.addressId).toBe('addr-1')
    expect(await screen.findByText('Cliente creato con successo!')).toBeInTheDocument()
  })

  it('T040 e-mail, telefone e nascimento vazios seguem como nulos', async () => {
    mockPeopleList([])

    const bodies = captureCreates()
    const user = await openNewForm()

    await user.type(screen.getByPlaceholderText('Mario Rossi'), 'Mario Rossi')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(bodies.person).toBeDefined())
    expect(bodies.person?.email).toBeNull()
    expect(bodies.person?.phone).toBeNull()
    expect(bodies.person?.birthDate).toBeNull()
    expect(Object.values(bodies.person ?? {})).not.toContain('')
    expect(await screen.findByText('Cliente creato con successo!')).toBeInTheDocument()
  })

  it('T039 editar e salvar sem mudar nada é aceito e mantém os vazios como nulos', async () => {
    let updated: Body | undefined

    mockPeopleList([
      makePerson({
        id: 'p1',
        name: 'Mario Rossi',
        role: 'owner',
        secondaryPhone: null,
        documentType: null,
        documentNumber: null,
        notes: null,
        birthDate: null,
        acquisitionSource: null,
        addressId: null,
      }),
    ])
    server.use(
      getPersonControllerUpdateByIdMockHandler(async ({ request }: PatchInfo) => {
        updated = (await request.json()) as Body
      }),
    )
    renderWithToasts(<Anagrafica />)

    const user = userEvent.setup()
    const row = (await screen.findByText('Mario Rossi')).closest('tr') as HTMLElement

    await user.click(within(row).getAllByRole('button')[1] as HTMLElement)
    await user.click(await screen.findByRole('button', { name: 'Salva' }))

    await waitFor(() => expect(updated).toBeDefined())
    expect(updated?.name).toBe('Mario Rossi')
    expect(updated?.email).toBeNull()
    expect(updated?.birthDate).toBeNull()
    expect(updated?.notes).toBeNull()
    expect(JSON.stringify(updated)).not.toContain('undefined')
    expect(await screen.findByText('Cliente aggiornato con successo!')).toBeInTheDocument()
  })
})
