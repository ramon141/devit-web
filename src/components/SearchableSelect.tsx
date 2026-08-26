import { useId, useState } from 'react'
import { ChevronsUpDown, XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type SearchableSelectOption = {
  value: string
  label: string
}

type SearchableSelectProps = {
  options: SearchableSelectOption[]
  value: string | undefined
  onValueChange: (value: string) => void
  label?: string
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  error?: string
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  label,
  required = false,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  error,
}: SearchableSelectProps) {
  const { t } = useTranslation('common')
  const triggerId = useId()
  const [open, setOpen] = useState(false)
  const resolvedPlaceholder = placeholder ?? t('searchableSelect.placeholder')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('searchableSelect.searchPlaceholder')
  const resolvedEmptyText = emptyText ?? t('searchableSelect.emptyText')

  const selected = options.find((option) => option.value === value)
  const showClear = !!value && !disabled

  function handleSelect(nextValue: string) {
    onValueChange(nextValue)
    setOpen(false)
  }

  function handleClear() {
    onValueChange('')
  }

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={triggerId}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <PopoverTrigger
            render={
              <Button
                id={triggerId}
                type="button"
                variant="outline"
                disabled={disabled}
                aria-invalid={!!error}
                className={cn(
                  'w-full justify-between font-normal',
                  showClear && 'pr-8',
                  !selected && 'text-muted-foreground'
                )}
              >
                {selected ? selected.label : resolvedPlaceholder}
                {showClear ? <span className="size-4" /> : <ChevronsUpDown className="text-muted-foreground" />}
              </Button>
            }
          />

          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={resolvedSearchPlaceholder} />
            <CommandList>
              <CommandEmpty>{resolvedEmptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={option.value === value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default SearchableSelect
