import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithProviders } from '@/test'
import { useIsDesktop } from '@/hooks/useIsDesktop'

function stubWidth(width: number) {
  vi.stubGlobal('matchMedia', (query: string) => {
    const min = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0)

    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('T299 largura de celular', () => {
  it.each([
    [800, false],
    [1023, false],
    [1024, true],
    [1440, true],
  ])('largura %spx => desktop=%s', (width, expected) => {
    stubWidth(width)
    const { result } = renderHookWithProviders(() => useIsDesktop())

    expect(result.current).toBe(expected)
  })
})
