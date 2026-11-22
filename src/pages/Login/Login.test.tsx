import { describe, expect, it } from 'vitest'
import {
  getAuthControllerLoginMockHandler,
  getAuthControllerLoginResponseMock,
} from '@/api/generated/api.msw'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import { UserInfo } from '@/auth'
import Login from '@/pages/Login'

const EMAIL_PLACEHOLDER = 'tu@devit.it'
const PASSWORD_PLACEHOLDER = '••••••••'
const SUBMIT_LABEL = /accedi/i

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()

  await user.type(screen.getByPlaceholderText(EMAIL_PLACEHOLDER), email)
  await user.type(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER), password)
  await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }))
}

describe('Login', () => {
  it('envia as credenciais e guarda os dados do usuário', async () => {
    let sentBody: unknown

    server.use(
      getAuthControllerLoginMockHandler(async ({ request }) => {
        sentBody = await request.json()

        return getAuthControllerLoginResponseMock({
          user: { id: 'u1', fullName: 'Admin', email: 'admin@devit.com', accessLevel: 'ADMIN' },
        })
      }),
    )

    renderWithProviders(<Login />)
    await fillAndSubmit('admin@devit.com', 'admin123')

    await waitFor(() => expect(UserInfo.getUserId()).toBe('u1'))
    expect(sentBody).toEqual({ email: 'admin@devit.com', password: 'admin123' })
  })

  it('mostra o erro devolvido pela API', async () => {
    server.use(
      apiError('*/auth/login', 401, { error: { statusCode: 401, message: 'Credenziali errate' } }),
    )

    renderWithProviders(<Login />)
    await fillAndSubmit('admin@devit.com', 'senha-errada')

    expect(await screen.findByText('Credenziali errate')).toBeInTheDocument()
    expect(UserInfo.getUserId()).toBeNull()
  })

  it('bloqueia o envio com e-mail inválido', async () => {
    renderWithProviders(<Login />)
    await fillAndSubmit('nao-e-email', 'admin123')

    expect(await screen.findByText('E-mail non valida')).toBeInTheDocument()
    expect(UserInfo.getUserId()).toBeNull()
  })
})
