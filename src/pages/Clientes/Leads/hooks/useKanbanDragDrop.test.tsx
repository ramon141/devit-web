import { describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useToast } from '@/contexts/ToastContext'
import { apiError, renderHookWithProviders, server, waitFor } from '@/test'
import { useKanbanDragDrop } from '@/pages/Clientes/Leads/hooks/useKanbanDragDrop'
import { makeDragEnd, makeDragStart, makeLead } from '@/pages/Clientes/Leads/leadsTestData'

const LEADS = [
  makeLead('a', 'new'),
  makeLead('b', 'contacted'),
  makeLead('c', 'negotiating'),
  makeLead('d', 'negotiating'),
  makeLead('e', 'negotiating'),
  makeLead('f', 'negotiating'),
]

type PatchCall = { id: string; body: Record<string, number | string> }

// Registra os PATCH enviados para /leads/:id
function capturePatches() {
  const calls: PatchCall[] = []

  server.use(
    http.patch('*/leads/:id', async ({ request, params }) => {
      const body = (await request.json()) as PatchCall['body']

      calls.push({ id: String(params.id), body })

      return new HttpResponse(null, { status: 204 })
    }),
  )

  return calls
}

function setup() {
  return renderHookWithProviders(() => ({
    dnd: useKanbanDragDrop({ leads: LEADS }),
    toast: useToast(),
  }))
}

describe('useKanbanDragDrop', () => {
  it('T069 move de Novo para Contatado, avisa sucesso e recarrega o quadro', async () => {
    const calls = capturePatches()
    const { result, queryClient } = setup()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    act(() => result.current.dnd.handleDragEnd(makeDragEnd('a', 'contacted')))

    await waitFor(() => expect(invalidate).toHaveBeenCalled())
    expect(calls).toEqual([{ id: 'a', body: { status: 'contacted', kanbanPosition: 1 } }])

    await waitFor(() =>
      expect(result.current.toast.toasts.map((item) => item.message)).toContain(
        'Richiesta spostata con successo!',
      ),
    )
  })

  it('T070 soltar na mesma coluna não envia nada nem avisa', async () => {
    const calls = capturePatches()
    const { result } = setup()

    act(() => result.current.dnd.handleDragEnd(makeDragEnd('b', 'contacted')))
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(calls).toEqual([])
    expect(result.current.toast.toasts).toEqual([])
  })

  it('T071 soltar fora de qualquer coluna não envia nada e limpa o cartão ativo', async () => {
    const calls = capturePatches()
    const { result } = setup()

    act(() => result.current.dnd.handleDragStart(makeDragStart('a')))
    expect(result.current.dnd.activeLead?.id).toBe('a')

    act(() => result.current.dnd.handleDragEnd(makeDragEnd('a', null)))
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(calls).toEqual([])
    expect(result.current.dnd.activeLead).toBeNull()
    expect(result.current.toast.toasts).toEqual([])
  })

  it('T072 envia a posição 4 ao soltar numa coluna que já tem 4 cartões', async () => {
    const calls = capturePatches()
    const { result } = setup()

    act(() => result.current.dnd.handleDragEnd(makeDragEnd('a', 'negotiating')))

    await waitFor(() => expect(calls).toHaveLength(1))
    expect(calls[0]?.body).toEqual({ status: 'negotiating', kanbanPosition: 4 })
  })

  it('T073 só inicia o arrasto depois de 8 pixels de movimento', () => {
    const { result } = setup()
    const pointer = result.current.dnd.sensors[0]

    expect(pointer?.options).toMatchObject({ activationConstraint: { distance: 8 } })
  })

  it('T074 mostra a mensagem do servidor quando ele recusa o movimento', async () => {
    server.use(
      apiError('*/leads/:id', 422, { error: { statusCode: 422, message: 'Mudança não permitida' } }, 'patch'),
    )
    const { result } = setup()

    act(() => result.current.dnd.handleDragEnd(makeDragEnd('a', 'contacted')))

    await waitFor(() =>
      expect(result.current.toast.toasts.map((item) => item.message)).toContain(
        'Mudança não permitida',
      ),
    )
    expect(result.current.toast.toasts.some((item) => item.variant === 'success')).toBe(false)
  })
})
