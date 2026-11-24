import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  type DateRangeValue,
  buildMonthWeeks,
  buildWeekdayLabels,
  formatRange,
  isBetween,
  maskRangeText,
  nextRange,
  parseRangeText,
} from './rangeUtils'

const day = (value: string) => dayjs(value)

describe('nextRange', () => {
  it('o primeiro clique define o início e passa a esperar o fim', () => {
    const result = nextRange([null, null], day('2026-10-10'), 'start')

    expect(result.range[0]?.format('YYYY-MM-DD')).toBe('2026-10-10')
    expect(result.range[1]).toBeNull()
    expect(result.position).toBe('end')
  })

  it('o segundo clique depois do início define o fim e volta a esperar o início', () => {
    const result = nextRange([day('2026-10-10'), null], day('2026-10-18'), 'end')

    expect(result.range[1]?.format('YYYY-MM-DD')).toBe('2026-10-18')
    expect(result.position).toBe('start')
  })

  it('clique no fim antes do início recomeça o intervalo', () => {
    const result = nextRange([day('2026-10-10'), null], day('2026-10-05'), 'end')

    expect(result.range[0]?.format('YYYY-MM-DD')).toBe('2026-10-05')
    expect(result.range[1]).toBeNull()
    expect(result.position).toBe('end')
  })

  it('novo início depois do fim antigo limpa o fim', () => {
    const existing: DateRangeValue = [day('2026-10-05'), day('2026-10-20')]
    const result = nextRange(existing, day('2026-10-25'), 'start')

    expect(result.range[1]).toBeNull()
  })

  it('novo início antes do fim antigo mantém o fim', () => {
    const existing: DateRangeValue = [day('2026-10-05'), day('2026-10-20')]
    const result = nextRange(existing, day('2026-10-14'), 'start')

    expect(result.range[1]?.format('YYYY-MM-DD')).toBe('2026-10-20')
  })
})

describe('máscara do campo', () => {
  it('aplica a máscara progressivamente', () => {
    expect(maskRangeText('10')).toBe('10')
    expect(maskRangeText('101020')).toBe('10/10/20')
    expect(maskRangeText('10102026')).toBe('10/10/2026')
    expect(maskRangeText('101020262')).toBe('10/10/2026 – 2')
    expect(maskRangeText('1010202620102026')).toBe('10/10/2026 – 20/10/2026')
  })

  it('ignora o que não é número e o excesso de dígitos', () => {
    expect(maskRangeText('ab10/10/2026 – DD/MM/AAAA')).toBe('10/10/2026')
    expect(maskRangeText('10102026201020269999')).toBe('10/10/2026 – 20/10/2026')
  })

  it('lê início e fim completos e ignora datas inválidas', () => {
    const [start, end] = parseRangeText('10/10/2026 – 20/10/2026')

    expect(start?.format('YYYY-MM-DD')).toBe('2026-10-10')
    expect(end?.format('YYYY-MM-DD')).toBe('2026-10-20')
    expect(parseRangeText('31/02/2026 – ')[0]).toBeNull()
    expect(parseRangeText('10/10/20')[0]).toBeNull()
  })

  it('formata o intervalo para exibição', () => {
    expect(formatRange([null, null])).toBe('')
    expect(formatRange([day('2026-10-10'), null])).toBe('10/10/2026 – ')
    expect(formatRange([day('2026-10-10'), day('2026-10-20')])).toBe('10/10/2026 – 20/10/2026')
  })
})

describe('calendário', () => {
  it('monta as semanas do mês de domingo a sábado com células vazias fora do mês', () => {
    const weeks = buildMonthWeeks(day('2026-10-01'))
    const flatDays = weeks.flat().filter(Boolean)

    expect(weeks).toHaveLength(5)
    expect(weeks[0]?.slice(0, 4)).toEqual([null, null, null, null])
    expect(weeks[0]?.[4]?.date()).toBe(1)
    expect(flatDays).toHaveLength(31)
  })

  it('gera as iniciais dos dias da semana começando no domingo', () => {
    expect(buildWeekdayLabels()).toHaveLength(7)
  })

  it('isBetween considera início e fim inclusos', () => {
    const start = day('2026-10-05')
    const end = day('2026-10-10')

    expect(isBetween(day('2026-10-05'), start, end)).toBe(true)
    expect(isBetween(day('2026-10-10'), start, end)).toBe(true)
    expect(isBetween(day('2026-10-11'), start, end)).toBe(false)
    expect(isBetween(day('2026-10-07'), start, null)).toBe(false)
  })
})
