import type { Dayjs } from 'dayjs'
import { cn } from '@/lib/utils'
import type { DayState } from './dayState'

type RangeDayProps = DayState & {
  day: Dayjs
  focusable: boolean
  onSelect: (day: Dayjs) => void
  onHover: (day: Dayjs) => void
}

const previewClasses = (previewed: boolean, start: boolean, end: boolean): string =>
  cn(
    'border-2 border-transparent',
    previewed && 'border-y-border border-dashed',
    previewed && start && 'rounded-l-full border-l-border',
    previewed && end && 'rounded-r-full border-r-border',
  )

// Um dia do calendário: faixa do intervalo, pré-visualização tracejada e botão
function RangeDay(props: RangeDayProps) {
  const { day, selected, highlighted, roundStart, roundEnd, today } = props

  return (
    <div
      className={cn(
        highlighted && 'bg-accent',
        roundStart && 'rounded-l-full',
        roundEnd && 'rounded-r-full',
      )}
    >
      <div className={previewClasses(props.previewed, props.previewStart, props.previewEnd)}>
        <button
          type="button"
          role="gridcell"
          aria-selected={selected}
          aria-current={today ? 'date' : undefined}
          tabIndex={props.focusable ? 0 : -1}
          onClick={() => props.onSelect(day)}
          onMouseEnter={() => props.onHover(day)}
          className={cn(
            'size-9 rounded-full text-xs transition-colors duration-150 outline-none',
            selected
              ? 'bg-primary font-medium text-primary-foreground hover:bg-primary/85'
              : 'hover:bg-accent focus:bg-accent',
            !selected && !highlighted && 'hover:border hover:border-muted-foreground/50',
            today && !selected && 'border border-muted-foreground',
          )}
        >
          {day.date()}
        </button>
      </div>
    </div>
  )
}

export default RangeDay
