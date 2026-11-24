import { useId, useRef, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import RangeCalendar from './RangeCalendar'
import type { DateRangeValue } from './rangeUtils'
import { useRangeText } from './useRangeText'

export type { DateRangeValue } from './rangeUtils'

type DateRangePickerProps = {
  label: string
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  id?: string
}

// Seletor de período: campo com máscara "DD/MM/AAAA – DD/MM/AAAA" + calendário duplo
function DateRangePicker({ label, value, onChange, id }: DateRangePickerProps) {
  const { t } = useTranslation('common')
  const inputId = useId()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)

  const shrink = focused || open || value[0] !== null || value[1] !== null
  const text = useRangeText({ value, onChange, showMask: shrink, mask: t('dateRangePicker.mask') })
  const hasOnlyStart = Boolean(value[0] && !value[1])
  const invalid = hasOnlyStart && (open || text.isIncompleteFromCalendar)

  return (
    <FormFieldWrapper id={id} label={label} htmlFor={inputId}>
      <div ref={anchorRef} className="relative">
        <Input
          id={inputId}
          ref={text.inputRef}
          value={text.display}
          placeholder={t('dateRangePicker.placeholder')}
          aria-invalid={invalid}
          onChange={text.handleChange}
          onKeyDown={text.handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn('pr-10', open && 'border-ring ring-3 ring-ring/50')}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            aria-label={t('dateRangePicker.choose')}
            className={cn(
              'absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center',
              'rounded-md text-muted-foreground outline-none transition-colors',
              'hover:text-foreground focus-visible:text-foreground data-popup-open:text-foreground',
            )}
          >
            <CalendarIcon className="size-4" />
          </PopoverTrigger>

          <PopoverContent anchor={anchorRef} align="start" className="w-auto gap-0 p-0">
            <RangeCalendar value={value} onChange={onChange} onComplete={() => setOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </FormFieldWrapper>
  )
}

export default DateRangePicker
