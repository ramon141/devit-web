import { useEffect, useRef, useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import RangeMonth from './RangeMonth'
import { type DateRangeValue, type RangePosition, nextRange } from './rangeUtils'

const CALENDARS_COUNT = 2

const CALENDAR_INDEXES = Array.from({ length: CALENDARS_COUNT }, (_, index) => index)

const FOCUSABLE_DAY_SELECTOR = '[role="gridcell"][tabindex="0"]'

type RangeCalendarProps = {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  onComplete: () => void
}

const initialMonth = ([start, end]: DateRangeValue): Dayjs =>
  (start ?? end ?? dayjs()).startOf('month')

// Primeiro clique define o início, o segundo o fim (e fecha o calendário)
function useRangeSelection({ value, onChange, onComplete }: RangeCalendarProps) {
  const [position, setPosition] = useState<RangePosition>('start')

  function handleSelect(day: Dayjs) {
    const result = nextRange(value, day, position)

    onChange(result.range)
    setPosition(result.position)

    if (position === 'end' && result.position === 'start') onComplete()
  }

  return { position, handleSelect }
}

function RangeCalendar(props: RangeCalendarProps) {
  const { value } = props
  const [baseMonth, setBaseMonth] = useState<Dayjs>(() => initialMonth(value))
  const [hovered, setHovered] = useState<Dayjs | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { position, handleSelect } = useRangeSelection(props)

  // Ao abrir, o dia de referência recebe o foco
  useEffect(() => {
    containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_DAY_SELECTOR)?.focus()
  }, [])

  return (
    <div ref={containerRef} className="flex">
      {CALENDAR_INDEXES.map((index) => (
        <div key={index} className={index < CALENDARS_COUNT - 1 ? 'border-r border-border' : undefined}>
          <RangeMonth
            month={baseMonth.add(index, 'month')}
            range={value}
            hovered={hovered}
            position={position}
            focusDay={value[0] ?? dayjs()}
            showPrevious={index === 0}
            showNext={index === CALENDARS_COUNT - 1}
            onPrevious={() => setBaseMonth(baseMonth.subtract(1, 'month'))}
            onNext={() => setBaseMonth(baseMonth.add(1, 'month'))}
            onSelect={handleSelect}
            onHover={setHovered}
          />
        </div>
      ))}
    </div>
  )
}

export default RangeCalendar
