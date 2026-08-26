import { XIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SelectFieldOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  value?: string
  onValueChange: (value: string) => void
  options: SelectFieldOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
}

// Select de enum com label italiano resolvido, usado em todo formulário do sistema
function SelectField({
  value,
  onValueChange,
  options,
  placeholder = 'Seleziona',
  disabled,
  error,
}: SelectFieldProps) {
  const showClear = !!value && !disabled

  return (
    <div className="grid gap-1.5">
      <div className="relative">
        <Select
          value={value}
          onValueChange={(newValue) => onValueChange(newValue ?? '')}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-full"
            aria-invalid={!!error}
            icon={showClear ? <span className="size-4" /> : undefined}
          >
            <SelectValue placeholder={placeholder}>
              {(selected: string) => options.find((option) => option.value === selected)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={() => onValueChange('')}
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export default SelectField
