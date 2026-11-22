import { readFileSync } from 'node:fs'
import { z } from 'zod'
import * as bodySchemas from '../api/generated/api.zod'

/**
 * Confere o corpo de POST, PUT e PATCH com as regras que o próprio orval gera da especificação
 * (api.zod.ts): formato das datas, obrigatórios, vazio, valores aceitos e propriedades extras.
 * A rota de cada regra vem das rotas que o orval gera para os servidores falsos (api.msw.ts).
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

interface BodyRoute {
  pattern: RegExp
  method: string
  schema: z.ZodType
}

const MSW_FILE = 'src/api/generated/api.msw.ts'
const MSW_HANDLER_PATTERN = /export const get(\w+)MockHandler = [^\n]*\n\s*return http\.(post|put|patch)\('([^']+)'/g
const PATH_PARAMETER = /:\w+/g
const SCHEMA_SUFFIX = 'Body'

const schemaRegistry: Record<string, z.ZodType | RegExp | number | boolean | undefined> = bodySchemas

const lowerFirst = (text: string): string => `${text.charAt(0).toLowerCase()}${text.slice(1)}`

const toPattern = (mswPath: string): RegExp => {
  const path = mswPath.replace(/^\*/, '')
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, (char) => (char === ':' ? char : `\\${char}`))

  return new RegExp(`^${escaped.replace(PATH_PARAMETER, '[^/]+')}$`)
}

const loadRoutes = (): BodyRoute[] => {
  const routes: BodyRoute[] = []

  for (const [, operation, method, mswPath] of readFileSync(MSW_FILE, 'utf8').matchAll(MSW_HANDLER_PATTERN)) {
    const schema = schemaRegistry[`${lowerFirst(operation!)}${SCHEMA_SUFFIX}`]

    if (schema instanceof z.ZodType) routes.push({ pattern: toPattern(mswPath!), method: method!.toUpperCase(), schema })
  }

  return routes
}

let cachedRoutes: BodyRoute[] | undefined

const getRoutes = (): BodyRoute[] => {
  cachedRoutes ??= loadRoutes()

  return cachedRoutes
}

/** Erros do corpo enviado, ou lista vazia quando a rota não tem regra de corpo. */
export const validateRequestBody = (method: string, pathname: string, body: JsonValue): string[] => {
  const route = getRoutes().find((item) => item.method === method.toUpperCase() && item.pattern.test(pathname))

  if (!route) return []

  const result = route.schema.safeParse(body)

  if (result.success) return []

  return result.error.issues.map((issue) => `corpo.${issue.path.join('.')}: ${issue.message}`)
}
