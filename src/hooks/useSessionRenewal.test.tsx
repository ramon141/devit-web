import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/api/mutator'
import { renderHookWithProviders } from '@/test'
import { seedSession } from '@/test/accessHelpers'
import { Auth } from '@/auth'
import { useSessionRenewal } from '@/hooks/useSessionRenewal'

const THIRTY_MINUTES = 30 * 60 * 1000

describe('useSessionRenewal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('T020 logado: pede renovação a cada 30 minutos, e não antes', () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({})

    seedSession()
    renderHookWithProviders(() => useSessionRenewal())

    vi.advanceTimersByTime(THIRTY_MINUTES - 1000)
    expect(post).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)
    expect(post).toHaveBeenCalledTimes(1)
    expect(post).toHaveBeenCalledWith('/auth/refresh')

    vi.advanceTimersByTime(THIRTY_MINUTES)
    expect(post).toHaveBeenCalledTimes(2)
  })

  it('T020 sem login: nenhum pedido de renovação é feito', () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({})

    renderHookWithProviders(() => useSessionRenewal())
    vi.advanceTimersByTime(THIRTY_MINUTES * 3)

    expect(post).not.toHaveBeenCalled()
  })

  it('T021 falha na renovação passa em silêncio e mantém o usuário logado', async () => {
    const post = vi.spyOn(api, 'post').mockRejectedValue(new Error('Network Error'))
    const unhandled = vi.fn()

    process.on('unhandledRejection', unhandled)
    seedSession()
    renderHookWithProviders(() => useSessionRenewal())

    await vi.advanceTimersByTimeAsync(THIRTY_MINUTES)
    process.off('unhandledRejection', unhandled)

    expect(post).toHaveBeenCalledTimes(1)
    expect(unhandled).not.toHaveBeenCalled()
    expect(document.body.querySelector('[role="alert"]')).toBeNull()
    expect(Auth.isAuthenticated()).toBe(true)
  })
})
