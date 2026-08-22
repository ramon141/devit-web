import { useId } from 'react'
import type { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type InputMoneyProps = {
  value: string | undefined
  setValue: (value: string | undefined) => void
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
}

const centsFormatter = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatCents(digits: string) {
  if (!digits) return ''

  const numeric = Number(digits) / 100
  return centsFormatter.format(numeric)
}

function InputMoney({
  value,
  setValue,
  name,
  label,
  required = false,
  disabled = false,
  error,
  placeholder = '0,00',
}: InputMoneyProps) {
  const inputId = useId()
  const digits = value ? value.replace(/\D/g, '') : ''

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDigits = event.target.value.replace(/\D/g, '')

    if (!nextDigits) {
      setValue(undefined)
      return
    }

    setValue((Number(nextDigits) / 100).toFixed(2))
  }

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div className="relative">
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-muted-foreground',
            disabled && 'opacity-50'
          )}
        >
          €
        </span>

        <Input
          id={inputId}
          name={name}
          inputMode="decimal"
          disabled={disabled}
          placeholder={placeholder}
          value={formatCents(digits)}
          onChange={handleChange}
          aria-invalid={!!error}
          className="pl-9 text-right"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default InputMoney
