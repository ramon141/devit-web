import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PropertyWithRelations } from '@/api/generated/models'
import { getMediationDaysLeft } from '@/utils/mediationExpiry'

const NOW = '2026-06-15T10:30:00'

function propertyWith(mediationExpiresAt?: string | null) {
  return { propertyDetail: { mediationExpiresAt } } as PropertyWithRelations
}

const inDays = (days: number) => dayjs(NOW).add(days, 'day').format('YYYY-MM-DD')

describe('getMediationDaysLeft (contrato de intermediação)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))
  })

  afterEach(() => vi.useRealTimers())

  it('T122 contrato que vence em 31 dias não gera alerta', () => {
    expect(getMediationDaysLeft(propertyWith(inDays(31)))).toBeNull()
  })

  it('T123 vencendo em 30, 1 e 0 dias mostra alerta com os dias restantes', () => {
    expect(getMediationDaysLeft(propertyWith(inDays(30)))).toBe(30)
    expect(getMediationDaysLeft(propertyWith(inDays(1)))).toBe(1)
    expect(getMediationDaysLeft(propertyWith(inDays(0)))).toBe(0)
  })

  it('T124 contrato vencido ontem não gera alerta nem contagem negativa', () => {
    expect(getMediationDaysLeft(propertyWith(inDays(-1)))).toBeNull()
  })

  it('T125 sem data de vencimento não gera alerta e não quebra', () => {
    expect(getMediationDaysLeft(propertyWith(null))).toBeNull()
    expect(getMediationDaysLeft(propertyWith(undefined))).toBeNull()
    expect(getMediationDaysLeft({} as PropertyWithRelations)).toBeNull()
  })

  it('T126 data só com dia e data com hora completa dão a mesma contagem', () => {
    const dayOnly = getMediationDaysLeft(propertyWith('2026-06-25'))
    const withTime = getMediationDaysLeft(propertyWith('2026-06-25T23:59:59.000Z'))
    const midnight = getMediationDaysLeft(propertyWith('2026-06-25T00:00:00.000'))

    expect(dayOnly).toBe(10)
    expect(withTime).toBe(dayOnly)
    expect(midnight).toBe(dayOnly)
  })
})
