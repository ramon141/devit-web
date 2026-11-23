import { describe, expect, it, vi } from 'vitest'
import { Auth, UserInfo } from '@/auth'
import { seedSession, stubLocation } from '@/test/accessHelpers'
import { server } from '@/test'
import { http, HttpResponse } from 'msw'

describe('Auth', () => {
  it('T012 grava o nível ADMIN e o reconhece como administrador', () => {
    Auth.login({ user: { id: 'u1', fullName: 'A', email: 'a@devit.com', accessLevel: 'ADMIN' } })

    expect(UserInfo.getAccessLevel()).toBe('ADMIN')
    expect(Auth.isAdmin()).toBe(true)
  })

  it('T012 grava o nível BROKER e não o reconhece como administrador', () => {
    Auth.login({ user: { id: 'u2', fullName: 'B', email: 'b@devit.com', accessLevel: 'BROKER' } })

    expect(UserInfo.getAccessLevel()).toBe('BROKER')
    expect(Auth.isAdmin()).toBe(false)
    expect(Auth.isAuthenticated()).toBe(true)
  })

  it('T013 login sem código do usuário lança erro e não grava nada', () => {
    expect(() => Auth.login({ user: { fullName: 'Sem Id' } })).toThrow(/Token mancante/)

    expect(Auth.isAuthenticated()).toBe(false)
    expect(UserInfo.getFullName()).toBeNull()
  })

  it('T019 sair avisa o servidor, apaga os dados locais e vai ao login', async () => {
    let logoutCalls = 0
    const location = stubLocation()

    server.use(
      http.post('*/auth/logout', () => {
        logoutCalls += 1

        return HttpResponse.json({})
      }),
    )
    seedSession()

    Auth.logout()

    await vi.waitFor(() => expect(logoutCalls).toBe(1))
    expect(Auth.isAuthenticated()).toBe(false)
    expect(UserInfo.getFullName()).toBeNull()
    expect(UserInfo.getEmail()).toBeNull()
    expect(UserInfo.getAccessLevel()).toBeNull()
    expect(location.href).toMatch(/\/gestionale\/login$/)
  })
})
