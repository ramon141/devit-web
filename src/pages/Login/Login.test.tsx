import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import {
  apiError,
  apiNetworkError,
  renderWithProviders,
  screen,
  server,
  waitFor,
} from '@/test'
import { currentPath, fillLogin, recordCalls, EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER, SUBMIT_LABEL } from '@/test/accessHelpers'
import { LocationProbe } from '@/test/LocationProbe'
import type { JsonValue } from '@/test/requestBodyValidator'
import { UserInfo } from '@/auth'
import Login from '@/pages/Login'

const ADMIN_USER = {
  user: { id: 'u1', fullName: 'Admin Devit', email: 'admin@devit.com', accessLevel: 'ADMIN' },
}

function renderLogin() {
  return renderWithProviders(
    <>
      <Login />
      <LocationProbe />
    </>,
    { initialEntries: ['/gestionale/login'] },
  )
}

describe('Login', () => {
  it('T001 entra com credenciais corretas, guarda o usuário e vai ao painel', async () => {
    const { calls, handler } = recordCalls('post', '*/auth/login', ADMIN_USER)

    server.use(handler)
    renderLogin()
    await fillLogin('admin@devit.com', 'admin123')

    await waitFor(() => expect(currentPath()).toBe('/gestionale'))
    expect(UserInfo.getUserId()).toBe('u1')
    expect(UserInfo.getFullName()).toBe('Admin Devit')
    expect(UserInfo.getEmail()).toBe('admin@devit.com')
    expect(UserInfo.getAccessLevel()).toBe('ADMIN')
    expect(calls.body).toEqual({ email: 'admin@devit.com', password: 'admin123' })
  })

  it('T002 mostra a mensagem do servidor com senha errada e mantém os campos', async () => {
    server.use(
      apiError('*/auth/login', 401, { error: { statusCode: 401, message: 'Credenziali errate' } }),
    )
    renderLogin()
    await fillLogin('admin@devit.com', 'senha-errada')

    expect(await screen.findByText('Credenziali errate')).toBeInTheDocument()
    expect(UserInfo.getUserId()).toBeNull()
    expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).toHaveValue('admin@devit.com')
    expect(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER)).toHaveValue('senha-errada')
  })

  it.each(['abc', 'a@', 'a@b'])('T003 barra e-mail inválido "%s" sem chamar o servidor', async (email) => {
    const { calls, handler } = recordCalls('post', '*/auth/login', ADMIN_USER)

    server.use(handler)
    renderLogin()
    await fillLogin(email, 'admin123')

    expect(await screen.findByText('E-mail non valida')).toBeInTheDocument()
    expect(calls.count).toBe(0)
  })

  it('T004 e-mail em branco mostra "obrigatório" e some ao corrigir', async () => {
    renderLogin()

    const user = await fillLogin('', 'admin123')

    expect(await screen.findByText("L'e-mail è obbligatoria")).toBeInTheDocument()
    expect(screen.queryByText('E-mail non valida')).not.toBeInTheDocument()

    await user.click(screen.getByPlaceholderText(EMAIL_PLACEHOLDER))
    await user.paste('admin@devit.com')

    await waitFor(() =>
      expect(screen.queryByText("L'e-mail è obbligatoria")).not.toBeInTheDocument(),
    )
  })

  it('T005 senha com 5 caracteres é barrada sem consultar o servidor', async () => {
    const { calls, handler } = recordCalls('post', '*/auth/login', ADMIN_USER)

    server.use(handler)
    renderLogin()
    await fillLogin('admin@devit.com', 'abcde')

    expect(
      await screen.findByText('La password deve contenere almeno 6 caratteri'),
    ).toBeInTheDocument()
    expect(calls.count).toBe(0)
  })

  it('T006 senha com exatamente 6 caracteres é enviada normalmente', async () => {
    const { calls, handler } = recordCalls('post', '*/auth/login', ADMIN_USER)

    server.use(handler)
    renderLogin()
    await fillLogin('admin@devit.com', 'abcdef')

    await waitFor(() => expect(calls.count).toBe(1))
    expect(screen.queryByText(/almeno 6 caratteri/)).not.toBeInTheDocument()
  })

  it('T007 e-mail de 300 e senha de 500 caracteres saem inteiros e o erro aparece', async () => {
    const email = `${'a'.repeat(291)}@devit.it`
    const password = 'p'.repeat(500)
    let sentBody: JsonValue | undefined

    server.use(
      http.post('*/auth/login', async ({ request }) => {
        sentBody = JSON.parse(await request.text()) as JsonValue

        return HttpResponse.json({ error: { message: 'Dati non validi' } }, { status: 422 })
      }),
    )
    renderLogin()
    await fillLogin(email, password)

    expect(await screen.findByText('Dati non validi')).toBeInTheDocument()
    expect(email).toHaveLength(300)
    expect(sentBody).toEqual({ email, password })
  })

  it('T008 duplo clique rápido faz uma única tentativa e desativa o botão', async () => {
    let count = 0

    server.use(
      http.post('*/auth/login', async () => {
        count += 1
        await delay('infinite')

        return HttpResponse.json({})
      }),
    )
    renderLogin()

    const user = await fillLogin('admin@devit.com', 'admin123', false)
    const button = screen.getByRole('button', { name: SUBMIT_LABEL })

    await user.dblClick(button)

    await waitFor(() => expect(button).toBeDisabled())
    expect(count).toBe(1)
  })

  it('T009 servidor fora do ar mostra aviso com o endereço e o formulário segue usável', async () => {
    server.use(apiNetworkError('*/auth/login'))
    renderLogin()
    await fillLogin('admin@devit.com', 'admin123')

    expect(await screen.findByText(/L'API non risponde/)).toHaveTextContent(
      'http://localhost:3006',
    )
    expect(screen.getByRole('button', { name: SUBMIT_LABEL })).toBeEnabled()
    expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).toBeEnabled()
  })

  it('T010 limite de tentativas (429) mostra a mensagem e libera o botão', async () => {
    server.use(
      apiError('*/auth/login', 429, {
        error: { statusCode: 429, message: 'Troppi tentativi, riprova tra 15 minuti' },
      }),
    )
    renderLogin()
    await fillLogin('admin@devit.com', 'admin123')

    expect(await screen.findByText('Troppi tentativi, riprova tra 15 minuti')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SUBMIT_LABEL })).toBeEnabled()
    expect(UserInfo.getUserId()).toBeNull()
  })

  // possível bug: o erro lançado por Auth.login não vem do servidor, então a tela mostra a
  // mensagem genérica em vez do aviso de dados incompletos (auth.tokenMissing)
  it.fails('T013 resposta sem identificação do usuário não deixa ninguém logado', async () => {
    server.use(
      http.post('*/auth/login', () => HttpResponse.json({ user: { fullName: 'Sem Id' } })),
    )
    renderLogin()
    await fillLogin('admin@devit.com', 'admin123')

    expect(await screen.findByText(/Token mancante/)).toBeInTheDocument()
    expect(UserInfo.getUserId()).toBeNull()
    expect(currentPath()).toBe('/gestionale/login')
  })
})
