import { useId, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
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
  placeholder = 'Seleziona un’opzione',
  searchPlaceholder = 'Cerca...',
  emptyText = 'Nessun risultato.',
  disabled = false,
  error,
}: SearchableSelectProps) {
  const triggerId = useId()
  const [open, setOpen] = useState(false)

  const selected = options.find((option) => option.value === value)

  function handleSelect(nextValue: string) {
    onValueChange(nextValue)
    setOpen(false)
  }

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={triggerId}>{label}</Label>}

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
              {selected ? selected.label : placeholder}
              <ChevronsUpDown className="text-muted-foreground" />
            </Button>
          }
        />

        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
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
