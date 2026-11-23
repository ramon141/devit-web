import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate, formatDateTime } from '@/utils/formatDate'

// Intl escreve o espaço antes do € como espaço inseparável
const nbsp = (text: string) => text.replace(/ /g, ' ')

describe('T288 valores em euro', () => {
  it.each([
    [0.5, '0,50 €'],
    [1234.5, '1234,50 €'],
    [1000000, '1.000.000,00 €'],
    [10000, '10.000,00 €'],
  ])('formata %s', (value, expected) => {
    expect(formatAmount(value)).toBe(nbsp(expected))
  })

  it('valor ausente vira traço', () => {
    expect(formatAmount(undefined)).toBe('—')
    expect(formatAmount(null)).toBe('—')
  })

  it('zero é mostrado, não tratado como ausente', () => {
    expect(formatAmount(0)).toBe(nbsp('0,00 €'))
  })
})

describe('T289 datas puras e com hora', () => {
  it('as duas formas mostram o mesmo dia', () => {
    expect(formatDate('2026-03-05')).toBe('05/03/2026')
    expect(formatDate('2026-03-05T00:00:00.000Z')).toBe('05/03/2026')
  })

  it('ausente vira traço', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate('')).toBe('—')
  })
})

describe('T290 data e hora no horário da Itália', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('inverno (UTC+1) e verão (UTC+2)', () => {
    expect(formatDateTime('2026-01-15T10:00:00.000Z')).toBe('15/01/2026 11:00:00')
    expect(formatDateTime('2026-07-15T10:00:00.000Z')).toBe('15/07/2026 12:00:00')
  })

  it('virada de dia respeita o fuso italiano', () => {
    expect(formatDateTime('2026-03-05T23:30:00.000Z')).toBe('06/03/2026 00:30:00')
  })

  it('ausente vira traço', () => {
    expect(formatDateTime(null)).toBe('—')
  })
})
