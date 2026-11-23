import {
  getPersonControllerCountMockHandler,
  getPersonControllerFindMockHandler,
  getPersonControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { PersonWithRelations } from '@/api/generated/models'
import { server } from '@/test'

type WhereClause = Record<string, string | { ilike?: string }>

type PersonFilter = {
  where?: Record<string, string | { ilike?: string } | WhereClause[]>
  limit?: number
  skip?: number
}

export function makePerson(overrides: Partial<PersonWithRelations>): PersonWithRelations {
  const [base] = getPersonControllerFindResponseMock()

  if (!base) throw new Error('Mock de pessoa vazio')

  return {
    ...base,
    email: null,
    phone: null,
    address: undefined,
    ...overrides,
  }
}

export function readFilter(url: string): PersonFilter {
  const raw = new URL(url).searchParams.get('filter')

  return raw ? (JSON.parse(raw) as PersonFilter) : {}
}

// Lista fixa de pessoas; paginação feita como o servidor (limit/skip) e contagem total
export function mockPeopleList(
  people: PersonWithRelations[],
  onFind?: (filter: PersonFilter) => void,
) {
  server.use(
    getPersonControllerFindMockHandler(({ request }) => {
      const filter = readFilter(request.url)

      onFind?.(filter)

      const skip = filter.skip ?? 0

      return people.slice(skip, skip + (filter.limit ?? people.length))
    }),
    getPersonControllerCountMockHandler({ count: people.length }),
  )
}
