import dayjs, { type Dayjs } from 'dayjs'
import DateRangePicker, { type DateRangeValue } from './index'

const VALUE_FORMAT = 'YYYY-MM-DD'

type DateRangeTextPickerProps = {
  label: string
  from: string
  to: string
  onChange: (from: string, to: string) => void
  id?: string
}

const toDayjs = (value: string): Dayjs | null => (value ? dayjs(value) : null)

const toValue = (date: Dayjs | null): string =>
  date && date.isValid() ? date.format(VALUE_FORMAT) : ''

// Adapta o seletor de período para filtros que guardam "de" e "até" como texto (YYYY-MM-DD)
function DateRangeTextPicker({ label, from, to, onChange, id }: DateRangeTextPickerProps) {
  return (
    <DateRangePicker
      id={id}
      label={label}
      value={[toDayjs(from), toDayjs(to)]}
      onChange={([start, end]: DateRangeValue) => onChange(toValue(start), toValue(end))}
    />
  )
}

export default DateRangeTextPicker
