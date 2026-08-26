import { useId, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
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

  function handleSelect(nextValue: string) {
    onValueChange(nextValue)
    setOpen(false)
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
                !selected && 'text-muted-foreground'
              )}
            >
              {selected ? selected.label : resolvedPlaceholder}
              <ChevronsUpDown className="text-muted-foreground" />
            </Button>
          }
        />

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
