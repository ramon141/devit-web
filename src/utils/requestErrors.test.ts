import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  getErrorMessageFromRequest,
  type ApiErrorResponse,
} from '@/utils/getErrorMessageFromRequest'

function buildError(status: number, data: ApiErrorResponse) {
  const config = { headers: new AxiosHeaders() }

  return new AxiosError<ApiErrorResponse>('fail', 'ERR', config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  })
}

describe('T295 erro com vários detalhes por campo', () => {
  it('junta as mensagens reais de cada campo', () => {
    const error = buildError(422, {
      error: {
        message: 'Dados da requisição inválidos',
        details: [
          { path: 'name', message: 'Nome obrigatório' },
          { path: 'email', message: 'E-mail inválido' },
          { path: 'phone' },
        ],
      },
    })

    const message = getErrorMessageFromRequest(error)

    expect(message).toBe('Nome obrigatório E-mail inválido')
    expect(message).not.toContain('Dados da requisição')
  })

  it('código conhecido usa a tradução do idioma atual', () => {
    const error = buildError(400, {
      error: { code: 'error_message_buyer_not_found', message: 'raw' },
    })

    expect(getErrorMessageFromRequest(error)).toBe(
      i18n.t('error_message_buyer_not_found', { ns: 'errors' }),
    )
  })
})

describe('T296 erro sem mensagem', () => {
  it('usa a mensagem padrão do sistema', () => {
    const message = getErrorMessageFromRequest(buildError(500, {}))

    expect(message).toBe(i18n.t('error_message_default', { ns: 'errors' }))
    expect(message.length).toBeGreaterThan(0)
  })

  it('usa a mensagem padrão do módulo quando informada', () => {
    expect(getErrorMessageFromRequest(buildError(500, {}), 'Falha ao salvar')).toBe(
      'Falha ao salvar',
    )
  })

  it('detalhes vazios não geram mensagem vazia', () => {
    const error = buildError(422, { error: { message: 'Erro X', details: [{ path: 'a' }] } })

    expect(getErrorMessageFromRequest(error)).toBe('Erro X')
  })
})

// possível teste futuro: shouldRetryQuery é função local de App.tsx (não exportada)
// e o código de produção não pode ser alterado nesta etapa
describe('T297 repetição de consultas', () => {
  it.skip('T297 erro 4xx não repete e erro de rede repete até 3 vezes (função não exportada)', () => {})
})
