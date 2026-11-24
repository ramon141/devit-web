import { useId } from 'react'
import type { Dayjs } from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import RangeDay from './RangeDay'
import { computeDayState } from './dayState'
import {
  type DateRangeValue,
  type RangePosition,
  buildMonthWeeks,
  buildWeekdayLabels,
} from './rangeUtils'

type DaySelectionProps = {
  range: DateRangeValue
  hovered: Dayjs | null
  position: RangePosition
  focusDay: Dayjs
  onSelect: (day: Dayjs) => void
  onHover: (day: Dayjs | null) => void
}

type RangeMonthProps = DaySelectionProps & {
  month: Dayjs
  showPrevious: boolean
  showNext: boolean
  onPrevious: () => void
  onNext: () => void
}

type MonthHeaderProps = Pick<RangeMonthProps, 'month' | 'showPrevious' | 'showNext'> &
  Pick<RangeMonthProps, 'onPrevious' | 'onNext'> & { labelId: string }

const arrowClass = 'flex size-8 items-center justify-center rounded-full hover:bg-accent'

function MonthHeader({ month, labelId, showPrevious, showNext, onPrevious, onNext }: MonthHeaderProps) {
  const { t } = useTranslation('common')

  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-1">
      <button
        type="button"
        aria-label={t('dateRangePicker.previousMonth')}
        onClick={onPrevious}
        className={cn(arrowClass, !showPrevious && 'invisible')}
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      <span id={labelId} aria-live="polite" className="text-sm font-medium capitalize">
        {month.format('MMMM YYYY')}
      </span>

      <button
        type="button"
        aria-label={t('dateRangePicker.nextMonth')}
        onClick={onNext}
        className={cn(arrowClass, !showNext && 'invisible')}
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  )
}

function WeekdayRow() {
  return (
    <div className="flex justify-center">
      {buildWeekdayLabels().map((label, index) => (
        <span
          key={index}
          className="flex size-10 items-center justify-center text-xs text-muted-foreground"
        >
          {label}
        </span>
      ))}
    </div>
  )
}

type WeekRowProps = DaySelectionProps & { week: (Dayjs | null)[] }

function WeekRow({ week, range, hovered, position, focusDay, onSelect, onHover }: WeekRowProps) {
  return (
    <div role="row" className="flex justify-center py-0.5">
      {week.map((day, column) =>
        day ? (
          <RangeDay
            key={column}
            day={day}
            {...computeDayState({ day, column, range, hovered, position })}
            focusable={day.isSame(focusDay, 'day')}
            onSelect={onSelect}
            onHover={onHover}
          />
        ) : (
          <div key={column} className="size-10" aria-hidden />
        ),
      )}
    </div>
  )
}

function RangeMonth({ month, showPrevious, showNext, onPrevious, onNext, ...selection }: RangeMonthProps) {
  const labelId = useId()

  return (
    <div className="w-[296px] px-2 pb-2">
      <MonthHeader
        month={month}
        labelId={labelId}
        showPrevious={showPrevious}
        showNext={showNext}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <div role="grid" aria-labelledby={labelId} onMouseLeave={() => selection.onHover(null)}>
        <WeekdayRow />

        <div className="flow-root min-h-[264px]">
          {buildMonthWeeks(month).map((week, weekIndex) => (
            <WeekRow key={weekIndex} week={week} {...selection} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RangeMonth
