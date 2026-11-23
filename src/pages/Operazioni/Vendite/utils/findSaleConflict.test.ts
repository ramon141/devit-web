import { describe, expect, it } from 'vitest'
import { getSaleControllerCountMockHandler } from '@/api/generated/api.msw'
import { server } from '@/test'
import { findSaleConflict } from './findSaleConflict'

// Responde 1 quando a consulta bate com o conflito simulado e 0 nas demais
function mockCounts(conflicts: { number?: boolean; propertySold?: boolean }) {
  const queries: string[] = []

  server.use(
    getSaleControllerCountMockHandler(({ request }) => {
      const query = decodeURIComponent(new URL(request.url).search)

      queries.push(query)

      const isSoldQuery = query.includes('sold')
      const conflict = isSoldQuery ? conflicts.propertySold : conflicts.number

      return { count: conflict ? 1 : 0 }
    }),
  )

  return queries
}

describe('findSaleConflict', () => {
  it('T185 criação com número já usado avisa número duplicado', async () => {
    mockCounts({ number: true })

    const conflict = await findSaleConflict({ number: 'V-100', propertyId: 'p1' })

    expect(conflict).toBe('duplicateNumber')
  })

  it('T185 edição da própria venda exclui o próprio id da busca e não conflita', async () => {
    const queries = mockCounts({ number: false })

    const conflict = await findSaleConflict({ number: 'V-100', propertyId: 'p1', saleId: 's1' })

    expect(conflict).toBeNull()
    expect(queries[0]).toContain('s1')
  })

  it('T186 criação para imóvel já vendido é bloqueada', async () => {
    mockCounts({ propertySold: true })

    const conflict = await findSaleConflict({ number: 'V-200', propertyId: 'p1' })

    expect(conflict).toBe('propertyAlreadySold')
  })

  it('T186 edição de venda existente não é bloqueada pela regra do imóvel', async () => {
    const queries = mockCounts({ propertySold: true })

    const conflict = await findSaleConflict({ number: 'V-200', propertyId: 'p1', saleId: 's1' })

    expect(conflict).toBeNull()
    expect(queries.some((query) => query.includes('sold'))).toBe(false)
  })
})
