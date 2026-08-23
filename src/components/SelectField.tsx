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
  return (
    <div className="grid gap-1.5">
      <Select
        value={value}
        onValueChange={(newValue) => onValueChange(newValue ?? '')}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder}>
            {(selected: string) => options.find((option) => option.value === selected)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export default SelectField
