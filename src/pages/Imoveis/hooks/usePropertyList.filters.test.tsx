import { act, renderHookWithProviders, waitFor } from '@/test'
import { makeRows, serveProperties, type ListRequest } from '@/pages/Imoveis/imoveisListHarness'
import { emptyPropertyFilters, usePropertyList } from './usePropertyList'

type Condition = Record<string, string | { gte?: number; lte?: number }>
type ParsedFilter = { where?: { and: Condition[] }; order?: string[] }

function parsedFilter(requests: ListRequest[]): ParsedFilter {
  const last = requests.filter((r) => r.url.pathname.endsWith('/properties')).at(-1)

  return JSON.parse(last?.url.searchParams.get('filter') ?? '{}') as ParsedFilter
}

function lastParam(requests: ListRequest[], name: string) {
  const last = requests.filter((r) => r.url.pathname.endsWith('/properties')).at(-1)

  return last?.url.searchParams.get(name)
}

describe('Imóveis: combinação de filtros da lista', () => {
  it('T102 filtros juntos enviam todos os critérios e limpar volta aos 12', async () => {
    const requests = serveProperties(makeRows(12))
    const { result } = renderHookWithProviders(() => usePropertyList())

    await waitFor(() => expect(result.current.totalItems).toBe(12))

    act(() => {
      result.current.setFilters({
        ...emptyPropertyFilters,
        status: 'available',
        purpose: 'sale',
        priceMin: '200000',
        priceMax: '400000',
        onlyMine: true,
        orderBy: 'salePrice_desc',
      })
    })

    await waitFor(() => expect(lastParam(requests, 'mine')).toBe('true'))

    const filter = parsedFilter(requests)
    const conditions = JSON.stringify(filter.where?.and)

    expect(conditions).toContain('"status":"available"')
    expect(conditions).toContain('"purpose":"sale"')
    expect(conditions).toContain('{"salePrice":{"gte":200000}}')
    expect(conditions).toContain('{"salePrice":{"lte":400000}}')
    expect(filter.order).toEqual(['salePrice DESC'])

    act(() => result.current.setFilters(emptyPropertyFilters))

    await waitFor(() => expect(lastParam(requests, 'mine')).toBeNull())
    expect(parsedFilter(requests).where).toBeUndefined()
    await waitFor(() => expect(result.current.properties).toHaveLength(10))
    expect(result.current.totalItems).toBe(12)
  })
})
