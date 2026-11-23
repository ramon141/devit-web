import { describe, expect, it } from 'vitest'
import { api } from '@/api/mutator'
import { apiError, server } from '@/test'
import { seedSession, stubLocation } from '@/test/accessHelpers'
import { UserInfo } from '@/auth'

describe('mutator (sessão expirada)', () => {
  it('T017 resposta 401 em consulta comum apaga a sessão e leva ao login', async () => {
    const location = stubLocation()

    seedSession()
    server.use(apiError('*/properties', 401, undefined, 'get'))

    await expect(api.get('/properties')).rejects.toBeDefined()

    expect(UserInfo.getUserId()).toBeNull()
    expect(UserInfo.getFullName()).toBeNull()
    expect(UserInfo.getEmail()).toBeNull()
    expect(UserInfo.getAccessLevel()).toBeNull()
    expect(location.href).toMatch(/\/gestionale\/login$/)
  })

  it('T018 401 no próprio login não redireciona nem apaga a sessão em laço', async () => {
    const location = stubLocation('http://localhost:3006/gestionale/login')

    seedSession()
    server.use(apiError('*/auth/login', 401, { error: { message: 'Credenziali errate' } }))

    await expect(api.post('/auth/login', {})).rejects.toBeDefined()

    expect(location.href).toBe('http://localhost:3006/gestionale/login')
    expect(UserInfo.getUserId()).toBe('u1')
  })
})
