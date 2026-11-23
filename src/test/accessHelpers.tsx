import { vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { screen, userEvent } from '@/test'
import type { JsonValue } from '@/test/requestBodyValidator'

export const EMAIL_PLACEHOLDER = 'tu@devit.it'
export const PASSWORD_PLACEHOLDER = '••••••••'
export const SUBMIT_LABEL = /accedi/i

export function currentPath(): string {
  return screen.getByTestId('location').textContent ?? ''
}

// Grava a sessão como se o usuário já tivesse feito login.
export function seedSession(accessLevel = 'ADMIN') {
  localStorage.setItem('userId', 'u1')
  localStorage.setItem('fullName', 'Admin Devit')
  localStorage.setItem('email', 'admin@devit.com')
  localStorage.setItem('accessLevel', accessLevel)
}

// Preenche (colando, para textos longos) e envia o formulário de login.
export async function fillLogin(email: string, password: string, submit = true) {
  const user = userEvent.setup()

  if (email) {
    await user.click(screen.getByPlaceholderText(EMAIL_PLACEHOLDER))
    await user.paste(email)
  }

  if (password) {
    await user.click(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER))
    await user.paste(password)
  }

  if (submit) await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }))

  return user
}

// Handler de rota que conta chamadas e guarda o último corpo enviado.
export function recordCalls(method: 'post' | 'get', path: string, response: JsonValue = {}) {
  const calls = { count: 0, body: undefined as JsonValue | undefined }

  const handler = http[method](path, async ({ request }) => {
    calls.count += 1

    if (method === 'post') {
      const text = await request.text()
      calls.body = text ? (JSON.parse(text) as JsonValue) : undefined
    }

    return HttpResponse.json(response)
  })

  return { calls, handler }
}

// Substitui window.location por um objeto que registra o endereço gravado em href
// (o jsdom não navega de verdade). Mantém origin/host para o axios continuar funcionando.
export function stubLocation(initialHref = 'http://localhost:3006/') {
  const real = window.location
  const state = { href: initialHref }

  vi.stubGlobal('location', {
    origin: real.origin,
    protocol: real.protocol,
    host: real.host,
    hostname: real.hostname,
    port: real.port,
    pathname: real.pathname,
    search: real.search,
    hash: real.hash,
    get href() {
      return state.href
    },
    set href(value: string) {
      state.href = value
    },
  })

  return state
}
