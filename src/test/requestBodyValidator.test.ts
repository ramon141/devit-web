import { describe, expect, it } from 'vitest'
import { validateRequestBody } from './requestBodyValidator'

describe('validateRequestBody (regras geradas pelo orval)', () => {
  it('aceita corpo válido', () => {
    const body = { email: 'admin@devit.com', password: 'admin123' }

    expect(validateRequestBody('POST', '/auth/login', body)).toEqual([])
  })

  it('recusa e-mail em formato inválido', () => {
    const errors = validateRequestBody('POST', '/auth/login', { email: 'x', password: 'admin123' })

    expect(errors.join(' ')).toContain('email')
  })

  it('recusa campo obrigatório ausente', () => {
    const errors = validateRequestBody('POST', '/auth/login', { email: 'admin@devit.com' })

    expect(errors.join(' ')).toContain('corpo.password')
  })

  it('recusa propriedade desconhecida', () => {
    const body = { email: 'admin@devit.com', password: 'admin123', extra: 1 }

    expect(validateRequestBody('POST', '/auth/login', body).join(' ')).toContain('extra')
  })

  it('ignora rota sem regra de corpo', () => {
    expect(validateRequestBody('POST', '/rota-inexistente', { qualquer: 1 })).toEqual([])
  })
})
