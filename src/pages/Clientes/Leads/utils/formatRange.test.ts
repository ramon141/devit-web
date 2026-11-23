import { describe, expect, it } from 'vitest'
import { formatRange } from '@/pages/Clientes/Leads/utils/formatRange'

describe('formatRange', () => {
  it('T067 usa ponto de milhar a partir de 5 dígitos e não em 4 dígitos', () => {
    expect(formatRange(10000, 25000)).toBe('10.000 — 25.000')
    expect(formatRange(1000, 2000)).toBe('1000 — 2000')
  })

  it('T068 mostra só o mínimo, só o máximo e nada quando o mínimo é "0.00"', () => {
    expect(formatRange(500, null)).toBe('≥ 500')
    expect(formatRange(null, 900)).toBe('≤ 900')
    expect(formatRange('0.00', null)).toBeNull()
    expect(formatRange('0.00', undefined)).toBeNull()
  })
})
