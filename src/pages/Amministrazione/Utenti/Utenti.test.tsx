import { describe, expect, it } from 'vitest'
import { HttpResponse, http } from 'msw'
import {
  getAttachmentControllerCreateMockHandler,
  getAttachmentControllerCreateResponseMock,
  getUserControllerCountMockHandler,
  getUserControllerCreateMockHandler,
  getUserControllerCreateResponseMock,
  getUserControllerFindMockHandler,
  getUserControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import type { JsonValue } from '@/test/requestBodyValidator'
import { apiError, screen, server, userEvent, waitFor } from '@/test'
import {
  clickSave,
  readJson,
  renderAdmin,
  rowButton,
  rowOf,
  first,
  typeInto,
} from '@/pages/Amministrazione/adminTestUtils'
import Utenti from '@/pages/Amministrazione/Utenti'
import Login from '@/pages/Login'

// Assinatura real de um PNG: o sistema confere o conteúdo, não só o tipo declarado
const PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 0x49, 0x48, 0x44, 0x52,
])

function makeUser(
  overrides: Partial<UserExcludingPasswordHashWithRelations> = {},
): UserExcludingPasswordHashWithRelations {
  return {
    ...first(getUserControllerFindResponseMock()),
    id: 'u1',
    fullName: 'Mario Rossi',
    email: 'mario@devit.it',
    accessLevel: 'broker',
    branchId: null,
    avatarId: null,
    active: true,
    ...overrides,
  }
}

function listUsers(users: UserExcludingPasswordHashWithRelations[]) {
  server.use(
    getUserControllerFindMockHandler(users),
    getUserControllerCountMockHandler({ count: users.length }),
  )
}

async function fillNewUser(name: string, email: string, password: string) {
  await typeInto('Mario Rossi', name)
  await typeInto('mario@devit.it', email)

  if (password) await typeInto('••••••••', password)
}

async function openNewUserModal() {
  await userEvent.setup().click(await screen.findByRole('button', { name: 'Nuovo utente' }))
}

describe('Tela de usuários', () => {
  it('T239 novo usuário sem senha mostra o aviso e não envia nada', async () => {
    let sent = false

    listUsers([])
    server.use(getUserControllerCreateMockHandler(() => {
      sent = true

      return getUserControllerCreateResponseMock()
    }))
    renderAdmin(<Utenti />)

    await openNewUserModal()
    await fillNewUser('Luca Verdi', 'luca@devit.it', '')
    await clickSave()

    expect(await screen.findByText('La password è obbligatoria per un nuovo utente')).toBeInTheDocument()
    expect(sent).toBe(false)
  })

  it('T240 editar só o nome sem digitar senha não envia a senha', async () => {
    let body: JsonValue | undefined

    listUsers([makeUser()])
    server.use(
      http.patch('*/users/u1', async ({ request }) => {
        body = await readJson(request)

        return new HttpResponse(null, { status: 204 })
      }),
    )
    renderAdmin(<Utenti />)

    await screen.findByText('Mario Rossi')
    await userEvent.setup().click(rowButton('Mario Rossi', 0))
    const nameInput = await screen.findByDisplayValue('Mario Rossi')

    await userEvent.setup().clear(nameInput)
    await userEvent.setup().type(nameInput, 'Mario Bianchi')
    await clickSave()

    expect(await screen.findByText('Utente aggiornato con successo!')).toBeInTheDocument()
    expect(body).toMatchObject({ fullName: 'Mario Bianchi' })
    expect(JSON.stringify(body)).not.toContain('password')
  })

  it('T244 e-mail já cadastrada mostra a mensagem real do servidor', async () => {
    listUsers([])
    server.use(
      apiError('*/users', 422, { error: { statusCode: 422, message: 'E-mail già in uso' } }),
    )
    renderAdmin(<Utenti />)

    await openNewUserModal()
    await fillNewUser('Luca Verdi', 'mario@devit.it', 'Abc12345!')
    await clickSave()

    expect(await screen.findByText('E-mail già in uso')).toBeInTheDocument()
    expect(screen.queryByText('Utente creato con successo!')).not.toBeInTheDocument()
  })

  it('T245 a lista mostra o usuário desativado como inativo', async () => {
    listUsers([makeUser(), makeUser({ id: 'u2', fullName: 'Anna Neri', active: false })])
    renderAdmin(<Utenti />)

    await screen.findByText('Anna Neri')

    expect(rowOf('Anna Neri')).toHaveTextContent('Inattivo')
    expect(rowOf('Mario Rossi')).toHaveTextContent('Attivo')
  })

  // possível bug: o cadastro de usuário novo envia avatarId, mas a especificação da API
  // não aceita esse campo na criação (corpo estrito) e o servidor devolve 422.
  it.fails('T246 foto válida é enviada e o código dela vai junto no cadastro', async () => {
    let attachment: JsonValue | undefined
    let created: JsonValue | undefined

    listUsers([])
    server.use(
      getAttachmentControllerCreateMockHandler(async ({ request }) => {
        attachment = await readJson(request)

        return getAttachmentControllerCreateResponseMock({ id: 'att-1' })
      }),
      getUserControllerCreateMockHandler(async ({ request }) => {
        created = await readJson(request)

        return getUserControllerCreateResponseMock()
      }),
    )
    renderAdmin(<Utenti />)

    await openNewUserModal()
    await fillNewUser('Luca Verdi', 'luca@devit.it', 'Abc12345!')

    const photo = new File([PNG_BYTES], 'foto.png', { type: 'image/png' })
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')

    if (!input) throw new Error('campo de foto não encontrado')

    await userEvent.setup().upload(input, photo)
    await clickSave()

    await waitFor(() => expect(created).toMatchObject({ avatarId: 'att-1' }))
    expect(attachment).toMatchObject({ originalName: 'foto.png', mimeType: 'image/png' })
  })

  it('T246 arquivo com conteúdo diferente do tipo é recusado e nada é criado', async () => {
    let userCreated = false
    let attachmentSent = false

    listUsers([])
    server.use(
      getAttachmentControllerCreateMockHandler(() => {
        attachmentSent = true

        return getAttachmentControllerCreateResponseMock()
      }),
      getUserControllerCreateMockHandler(() => {
        userCreated = true

        return getUserControllerCreateResponseMock()
      }),
    )
    renderAdmin(<Utenti />)

    await openNewUserModal()
    await fillNewUser('Luca Verdi', 'luca@devit.it', 'Abc12345!')

    const fake = new File(['isto é só texto'], 'foto.png', { type: 'image/png' })
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')

    if (!input) throw new Error('campo de foto não encontrado')

    await userEvent.setup().upload(input, fake)
    await clickSave()

    expect(
      await screen.findByText('Il contenuto del file non corrisponde al tipo dichiarato.'),
    ).toBeInTheDocument()
    expect(attachmentSent).toBe(false)
    expect(userCreated).toBe(false)
  })
})

describe('Login de usuário desativado', () => {
  it('T245 mostra a recusa do servidor e não grava nada', async () => {
    server.use(
      apiError('*/auth/login', 403, { error: { statusCode: 403, message: 'Utente disattivato' } }),
    )
    renderAdmin(<Login />)

    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tu@devit.it'), 'anna@devit.it')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Abc12345!')
    await user.click(screen.getByRole('button', { name: /accedi/i }))

    expect(await screen.findByText('Utente disattivato')).toBeInTheDocument()
    expect(localStorage.length).toBe(0)
  })
})
