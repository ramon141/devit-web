import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export type DateRangeValue = [Dayjs | null, Dayjs | null]

export type RangePosition = 'start' | 'end'

export const DISPLAY_FORMAT = 'DD/MM/YYYY'

export const RANGE_SEPARATOR = ' – '

const DIGITS_PER_DATE = 8

const MONTH_ROWS_MAX = 6

const DAYS_PER_WEEK = 7

export const isSameDay = (first: Dayjs | null, second: Dayjs | null): boolean =>
  Boolean(first && second && first.isSame(second, 'day'))

export const isBetween = (day: Dayjs, start: Dayjs | null, end: Dayjs | null): boolean =>
  Boolean(start && end && !day.isBefore(start, 'day') && !day.isAfter(end, 'day'))

// Semanas do mês (domingo a sábado); dias fora do mês viram null (células vazias)
export const buildMonthWeeks = (month: Dayjs): (Dayjs | null)[][] => {
  const first = month.startOf('month')
  const offset = first.diff(first.startOf('week'), 'day')
  const total = Math.ceil((offset + month.daysInMonth()) / DAYS_PER_WEEK)
  const weeks: (Dayjs | null)[][] = []

  for (let week = 0; week < Math.min(total, MONTH_ROWS_MAX); week += 1) {
    weeks.push(
      Array.from({ length: DAYS_PER_WEEK }, (_, column) => {
        const day = first.add(week * DAYS_PER_WEEK + column - offset, 'day')
        return day.isSame(month, 'month') ? day : null
      })
    )
  }

  return weeks
}

// Primeira letra da abreviação do dia da semana (mesmo critério do MUI)
export const buildWeekdayLabels = (): string[] =>
  Array.from({ length: DAYS_PER_WEEK }, (_, index) =>
    dayjs().startOf('week').add(index, 'day').format('dd').charAt(0).toUpperCase()
  )

// Regra do MUI: início → fim; fim antes do início recomeça; início novo depois do fim limpa o fim
export const nextRange = (
  range: DateRangeValue,
  day: Dayjs,
  position: RangePosition
): { range: DateRangeValue; position: RangePosition } => {
  const [start, end] = range

  if (position === 'end' && start) {
    if (day.isBefore(start, 'day')) return { range: [day, null], position: 'end' }
    return { range: [start, day], position: 'start' }
  }

  const keepEnd = end && !day.isAfter(end, 'day') ? end : null
  return { range: [day, keepEnd], position: 'end' }
}

// "01012024" → "01/01/2024"; só dígitos, até 16 → "01/01/2024 – 20/01/2024"
export const maskRangeText = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, DIGITS_PER_DATE * 2)
  const formatDate = (part: string): string =>
    [part.slice(0, 2), part.slice(2, 4), part.slice(4, 8)].filter(Boolean).join('/')
  const start = formatDate(digits.slice(0, DIGITS_PER_DATE))
  const end = formatDate(digits.slice(DIGITS_PER_DATE))

  return digits.length > DIGITS_PER_DATE ? `${start}${RANGE_SEPARATOR}${end}` : start
}

export const formatRange = ([start, end]: DateRangeValue): string => {
  if (!start && !end) return ''
  const startText = start ? start.format(DISPLAY_FORMAT) : ''
  return `${startText}${RANGE_SEPARATOR}${end ? end.format(DISPLAY_FORMAT) : ''}`
}

const parseDate = (text: string): Dayjs | null => {
  if (text.length < DIGITS_PER_DATE + 2) return null
  const parsed = dayjs(text, DISPLAY_FORMAT, true)
  return parsed.isValid() ? parsed : null
}

export const parseRangeText = (text: string): DateRangeValue => {
  const [startText = '', endText = ''] = text.split(RANGE_SEPARATOR)
  return [parseDate(startText), parseDate(endText)]
}
