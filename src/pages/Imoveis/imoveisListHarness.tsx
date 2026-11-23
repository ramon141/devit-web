import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import type { PropertyWithRelations } from '@/api/generated/models'
import { makeProperty } from '@/pages/Imoveis/imoveisTestData'

export type ListRequest = { url: URL }

// Lista em memória: responde find/count a partir do array (paginando com limit/skip)
export function serveProperties(
  rows: PropertyWithRelations[],
  requests: ListRequest[] = [],
) {
  server.use(
    http.get('*/properties/count', ({ request }) => {
      requests.push({ url: new URL(request.url) })

      return HttpResponse.json({ count: rows.length })
    }),
    http.get('*/properties', ({ request }) => {
      const url = new URL(request.url)
      const filter = JSON.parse(url.searchParams.get('filter') ?? '{}') as {
        limit?: number
        skip?: number
      }
      const skip = filter.skip ?? 0

      requests.push({ url })

      return HttpResponse.json(rows.slice(skip, skip + (filter.limit ?? rows.length)))
    }),
    http.get('*/property-categories', () => HttpResponse.json([])),
  )

  return requests
}

export function makeRows(count: number): PropertyWithRelations[] {
  return Array.from({ length: count }, (_, index) =>
    makeProperty({ id: `p${index + 1}`, code: `AP-${index + 1}`, title: `Immobile ${index + 1}` }),
  )
}
