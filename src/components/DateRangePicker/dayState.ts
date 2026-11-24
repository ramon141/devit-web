import dayjs, { type Dayjs } from 'dayjs'
import { type DateRangeValue, type RangePosition, isBetween, isSameDay } from './rangeUtils'

const LAST_COLUMN = 6

export interface DayState {
  selected: boolean
  highlighted: boolean
  roundStart: boolean
  roundEnd: boolean
  previewed: boolean
  previewStart: boolean
  previewEnd: boolean
  today: boolean
}

interface DayStateInput {
  day: Dayjs
  column: number
  range: DateRangeValue
  hovered: Dayjs | null
  position: RangePosition
}

// Intervalo tracejado enquanto o usuário escolhe o fim e passa o mouse sobre os dias
const previewRange = ({ range, hovered, position }: Omit<DayStateInput, 'day' | 'column'>): DateRangeValue => {
  const [start, end] = range

  if (position !== 'end' || !start || end || !hovered || hovered.isBefore(start, 'day')) {
    return [null, null]
  }

  return [start, hovered]
}

export const computeDayState = (input: DayStateInput): DayState => {
  const { day, column, range } = input
  const [start, end] = range
  const [previewStartDay, previewEndDay] = previewRange(input)
  const isFirstOfMonth = day.date() === 1
  const isLastOfMonth = day.date() === day.daysInMonth()
  const isRangeStart = isSameDay(day, start)
  const isRangeEnd = isSameDay(day, end)

  return {
    selected: isRangeStart || isRangeEnd,
    highlighted: end ? isBetween(day, start, end) : isRangeStart,
    roundStart: isRangeStart || isFirstOfMonth || column === 0,
    roundEnd: isRangeEnd || isLastOfMonth || column === LAST_COLUMN,
    previewed: isBetween(day, previewStartDay, previewEndDay),
    previewStart: isSameDay(day, previewStartDay) || isFirstOfMonth || column === 0,
    previewEnd: isSameDay(day, previewEndDay) || isLastOfMonth || column === LAST_COLUMN,
    today: isSameDay(day, dayjs()),
  }
}
