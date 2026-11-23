import { afterEach, describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import i18n from '@/i18n'
import { getAuthControllerMeMockHandler } from '@/api/generated/api.msw'
import { apiError, renderWithProviders, screen, server, waitFor } from '@/test'
import { currentPath, seedSession } from '@/test/accessHelpers'
import { LocationProbe } from '@/test/LocationProbe'
import Login from '@/pages/Login'

function renderLogin() {
  return renderWithProviders(
    <>
      <Login />
      <LocationProbe />
    </>,
    { initialEntries: ['/gestionale/login'] },
  )
}

describe('Login com sessão e idioma', () => {
  afterEach(async () => {
    await act(() => i18n.changeLanguage('it'))
  })

  it('T011 usuário já logado é levado direto ao painel', async () => {
    seedSession()
    server.use(getAuthControllerMeMockHandler())
    renderLogin()

    await waitFor(() => expect(currentPath()).toBe('/gestionale'))
  })

  it('T011 sessão recusada pelo servidor mantém o formulário de login', async () => {
    seedSession()
    server.use(apiError('*/auth/me', 401, undefined, 'get'))
    renderLogin()

    await waitFor(() => expect(localStorage.getItem('userId')).toBeNull())
    expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument()
  })

  it('T015 trocar para português traduz textos e avisos e guarda a escolha', async () => {
    const { container } = renderLogin()

    expect(screen.getByRole('button', { name: 'Accedi' })).toBeInTheDocument()
    await act(() => i18n.changeLanguage('pt'))

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByText('Digite suas credenciais para continuar')).toBeInTheDocument()
    expect(localStorage.getItem('lang')).toBe('pt')

    const form = container.querySelector('form')

    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(await screen.findByText('O e-mail é obrigatório')).toBeInTheDocument()
  })
})
