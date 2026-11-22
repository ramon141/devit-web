import { HttpResponse, delay, http } from 'msw'
import type { JsonValue } from './requestBodyValidator'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

// Handlers de erro que o orval NÃO gera (os mocks dele respondem sempre 200).
// Passe o retorno para server.use(...). O path aceita curinga de host, ex.:
// '*/auth/login'.

/** Resposta de erro com status e (opcional) corpo JSON. */
export const apiError = (
  path: string,
  status: number,
  body?: JsonValue,
  method: Method = 'post',
) =>
  http[method](path, () =>
    body === undefined
      ? new HttpResponse(null, { status })
      : HttpResponse.json(body, { status }),
  )

/** Falha de rede (sem resposta): dispara o catch do axios sem status HTTP. */
export const apiNetworkError = (path: string, method: Method = 'post') =>
  http[method](path, () => HttpResponse.error())

/** Resposta que nunca resolve: para testar estado de carregamento. */
export const apiPending = (path: string, method: Method = 'post') =>
  http[method](path, async () => {
    await delay('infinite')

    return new HttpResponse(null, { status: 200 })
  })
