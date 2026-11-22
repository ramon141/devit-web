import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { getDevitApiMock } from '@/api/generated/api.msw'
import { validateRequestBody } from './requestBodyValidator'
import type { JsonValue } from './requestBodyValidator'

const UNPROCESSABLE_ENTITY = 422
const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH']

// Como o servidor real: corpo fora da especificação (formato de data, obrigatório,
// nulo, propriedade extra) volta 422. Com o corpo correto devolve vazio e o handler
// do endpoint responde.
const bodyValidationHandler = http.all('*', async ({ request }) => {
  if (!METHODS_WITH_BODY.includes(request.method)) return undefined

  const text = await request.clone().text()

  if (!text) return undefined

  const pathname = new URL(request.url).pathname
  const errors = validateRequestBody(request.method, pathname, JSON.parse(text) as JsonValue)

  if (errors.length === 0) return undefined

  return HttpResponse.json(
    { error: { statusCode: UNPROCESSABLE_ENTITY, message: errors.join('; ') } },
    { status: UNPROCESSABLE_ENTITY },
  )
})

// Servidor MSW compartilhado. getDevitApiMock() registra um handler padrão (resposta
// faker) para cada endpoint da API. Nos testes, sobrescreva o que importar com
// server.use(getXxxMockHandler(resposta)).
export const server = setupServer(bodyValidationHandler, ...getDevitApiMock())

// server.use coloca o handler novo à frente; a validação precisa continuar sendo a primeira.
const addHandlers = server.use.bind(server)

server.use = (...handlers) => addHandlers(bodyValidationHandler, ...handlers)
