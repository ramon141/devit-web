import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { getLeadNeighborhoodControllerFindMockHandler } from '@/api/generated/api.msw'
import { renderHookWithProviders, server, waitFor } from '@/test'
import { useLeadNeighborhoods } from '@/pages/Clientes/Leads/hooks/useLeadNeighborhoods'

describe('useLeadNeighborhoods', () => {
  it('T077 remove só o bairro B, cria só o C e não mexe no A', async () => {
    const deleted: string[] = []
    const created: Record<string, string>[] = []

    server.use(
      getLeadNeighborhoodControllerFindMockHandler([
        { id: 'link-a', leadId: 'l1', neighborhoodId: 'A' },
        { id: 'link-b', leadId: 'l1', neighborhoodId: 'B' },
      ]),
      http.delete('*/lead-neighborhoods/:id', ({ params }) => {
        deleted.push(String(params.id))

        return new HttpResponse(null, { status: 204 })
      }),
      http.post('*/lead-neighborhoods', async ({ request }) => {
        const body = (await request.json()) as Record<string, string>

        created.push(body)

        return HttpResponse.json({ id: 'link-c', ...body })
      }),
    )

    const { result } = renderHookWithProviders(() => useLeadNeighborhoods('l1'))

    await waitFor(() => expect(result.current.neighborhoodIds).toEqual(['A', 'B']))

    await act(() => result.current.sync('l1', ['A', 'C']))

    expect(deleted).toEqual(['link-b'])
    expect(created).toEqual([{ leadId: 'l1', neighborhoodId: 'C' }])
  })
})
