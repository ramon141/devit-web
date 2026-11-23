import { describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import { http, HttpResponse } from 'msw'
import { UserInfo } from '@/auth'
import { OwnerPortalAuth } from '@/lib/ownerPortalAuth'
import AreaProprietariLogin from '@/pages/Site/AreaProprietari/Login'

const REQUIRED = 'Campo obbligatorio'
const INVALID = 'Email o PIN non validi'

function renderLogin() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<AreaProprietariLogin />} />
      <Route path="/area-proprietari" element={<p>Area riservata</p>} />
    </Routes>,
  )
}

async function submit(email: string, pin: string) {
  const user = userEvent.setup()

  if (email) await user.type(screen.getByLabelText('Email'), email)
  if (pin) await user.type(screen.getByLabelText('PIN'), pin)

  await user.click(screen.getByRole('button', { name: 'Accedi' }))
}

describe('Site público: acesso do proprietário', () => {
  it('T287 e-mail ou PIN vazios dão aviso sem consultar o servidor', async () => {
    let calls = 0

    server.use(
      http.post('*/owner-portal/login', () => {
        calls += 1

        return HttpResponse.json({ token: 't' })
      }),
    )

    renderLogin()
    await submit('', '1234')
    expect(await screen.findByText(REQUIRED)).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Accedi' }))
    expect(calls).toBe(0)
  })

  it('T287 PIN vazio com e-mail preenchido também dá aviso', async () => {
    renderLogin()
    await submit('dono@example.com', '')

    expect(await screen.findByText(REQUIRED)).toBeInTheDocument()
  })

  it('T287 credenciais erradas mostram uma única mensagem genérica', async () => {
    server.use(apiError('*/owner-portal/login', 401, { error: { message: 'PIN errato' } }))

    renderLogin()
    await submit('dono@example.com', '0000')

    expect(await screen.findByText(INVALID)).toBeInTheDocument()
    expect(screen.queryByText('PIN errato')).not.toBeInTheDocument()
    expect(OwnerPortalAuth.getToken()).toBeNull()
  })

  it('T287 credenciais corretas guardam o acesso separado do sistema interno', async () => {
    let sent: Record<string, string> = {}

    server.use(
      http.post('*/owner-portal/login', async ({ request }) => {
        sent = (await request.json()) as Record<string, string>

        return HttpResponse.json({ token: 'owner-token' })
      }),
    )

    renderLogin()
    await submit('dono@example.com', '4321')

    expect(await screen.findByText('Area riservata')).toBeInTheDocument()
    expect(sent).toEqual({ email: 'dono@example.com', pin: '4321' })
    expect(OwnerPortalAuth.getToken()).toBe('owner-token')
    expect(UserInfo.getUserId()).toBeNull()
    await waitFor(() => expect(localStorage.getItem('ownerPortalToken')).toBe('owner-token'))
  })

  it('T287 quem já tem acesso é levado direto à área do proprietário', async () => {
    OwnerPortalAuth.setToken('existing')

    renderLogin()

    expect(await screen.findByText('Area riservata')).toBeInTheDocument()
  })
})
