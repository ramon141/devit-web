import { useId, useState } from 'react'
import { ChevronsUpDown, PlusIcon, XIcon } from 'lucide-react'
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
  creatable?: boolean
  onCreate?: (name: string) => void
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
  creatable = false,
  onCreate,
}: SearchableSelectProps) {
  const { t } = useTranslation('common')
  const labelId = useId()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const resolvedPlaceholder = placeholder ?? t('searchableSelect.placeholder')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('searchableSelect.searchPlaceholder')
  const resolvedEmptyText = emptyText ?? t('searchableSelect.emptyText')

  const selected = options.find((option) => option.value === value)
  const showClear = !!value && !disabled

  const trimmedSearch = search.trim()
  const normalizedSearch = trimmedSearch.toLowerCase()

  // Filtro próprio por trecho do texto — o fuzzy do cmdk aceita matches soltos demais
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(normalizedSearch)
  )
  const hasExactMatch = options.some((option) => option.label.toLowerCase() === normalizedSearch)
  const showCreate = creatable && !!onCreate && !!trimmedSearch && !hasExactMatch

  function closePopover() {
    setOpen(false)
    setSearch('')
  }

  function handleSelect(nextValue: string) {
    onValueChange(nextValue)
    closePopover()
  }

  function handleCreate() {
    onCreate?.(trimmedSearch)
    closePopover()
  }

  function handleClear() {
    onValueChange('')
  }

  return (
    <div className="grid min-w-0 content-start gap-2">
      {label && (
        <Label id={labelId}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}

      <Popover
        open={open}
        onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closePopover())}
      >
        <div className="relative min-w-0">
          <PopoverTrigger
            render={
              <Button
                type="button"
                aria-labelledby={label ? labelId : undefined}
                variant="outline"
                disabled={disabled}
                aria-invalid={!!error}
                className={cn(
                  'w-full justify-between font-normal',
                  showClear && 'pr-8',
                  !selected && 'text-muted-foreground'
                )}
              >
                <span className="min-w-0 truncate">{selected ? selected.label : resolvedPlaceholder}</span>
                {showClear ? <span className="size-4 shrink-0" /> : <ChevronsUpDown className="shrink-0 text-muted-foreground" />}
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
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={resolvedSearchPlaceholder}
            />
            <CommandList>
              {!showCreate && filteredOptions.length === 0 && (
                <CommandEmpty>{resolvedEmptyText}</CommandEmpty>
              )}

              <CommandGroup>
                {filteredOptions.map((option) => (
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

              {showCreate && (
                <CommandGroup>
                  <CommandItem value={trimmedSearch} onSelect={handleCreate}>
                    <PlusIcon className="size-4" />
                    {t('searchableSelect.createOption', { name: trimmedSearch })}
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default SearchableSelect
