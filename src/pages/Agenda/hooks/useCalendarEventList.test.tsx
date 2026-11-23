import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import { getCalendarEventControllerFindMockHandler } from '@/api/generated/api.msw'
import { UserInfo } from '@/auth'
import { renderHookWithProviders, server, waitFor } from '@/test'
import { useCalendarEventList } from '@/pages/Agenda/hooks/useCalendarEventList'

type WhereCondition = Record<string, { inq?: string[]; ilike?: string } | string | undefined>

function trackFindFilters() {
  const wheres: WhereCondition[][] = []

  server.use(
    getCalendarEventControllerFindMockHandler(({ request }) => {
      const filter = new URL(request.url).searchParams.get('filter') ?? '{}'

      wheres.push((JSON.parse(filter) as { where: { and: WhereCondition[] } }).where.and)

      return []
    }),
  )

  return wheres
}

describe('Agenda: filtros lembrados', () => {
  it('T206 – sem escolha salva, mostra apenas o usuário logado', async () => {
    UserInfo.setUserId('u-logado')
    const { result } = renderHookWithProviders(() => useCalendarEventList())

    expect(result.current.filters.visibleUserIds).toEqual(['u-logado'])
  })

  it('T206 – usuários visíveis escolhidos continuam os mesmos depois de recarregar', async () => {
    UserInfo.setUserId('u-logado')
    const first = renderHookWithProviders(() => useCalendarEventList())

    act(() => {
      first.result.current.setFilters({
        ...first.result.current.filters,
        type: 'property_viewing',
        search: 'Rossi',
        visibleUserIds: ['u2', 'u3'],
      })
    })
    first.unmount()

    const reloaded = renderHookWithProviders(() => useCalendarEventList())

    expect(reloaded.result.current.filters.visibleUserIds).toEqual(['u2', 'u3'])
    // tipo e busca não são lembrados: só a escolha de agendas visíveis
    expect(reloaded.result.current.filters.type).toBe('')
    expect(reloaded.result.current.filters.search).toBe('')
  })

  it('T206 – só ligações prevalece sobre o tipo e usa agendadas + realizadas', async () => {
    UserInfo.setUserId('u1')
    const wheres = trackFindFilters()
    const { result } = renderHookWithProviders(() => useCalendarEventList())

    act(() => {
      result.current.setFilters({
        type: 'property_viewing',
        onlyCalls: true,
        search: 'Rossi',
        visibleUserIds: ['u1'],
      })
    })

    await waitFor(() => expect(wheres.some((and) => and.some((c) => 'type' in c))).toBe(true))
    const conditions = wheres.find((and) => and.some((c) => 'type' in c)) ?? []
    const typeCondition = conditions.find((c) => 'type' in c)

    expect(typeCondition).toEqual({ type: { inq: ['call_scheduled', 'call_completed'] } })
    expect(JSON.stringify(conditions)).not.toContain('property_viewing')
    expect(JSON.stringify(conditions)).toContain('%Rossi%')
  })

  it('T206 – eventos sem criador (criador removido) continuam visíveis', async () => {
    UserInfo.setUserId('u1')
    const wheres = trackFindFilters()
    renderHookWithProviders(() => useCalendarEventList())

    await waitFor(() => expect(wheres.length).toBeGreaterThan(0))

    expect(JSON.stringify(wheres[0])).toContain('"createdById":null')
  })
})
