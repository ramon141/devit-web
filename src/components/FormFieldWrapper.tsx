import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FormFieldWrapperProps = {
  label: string
  // Só para input/textarea de verdade: apontar para um trigger (botão do
  // SearchableSelect/Select) faz o hover do label virar hover do campo
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}

// Espelha o visual de aria-invalid nos campos filhos quando há erro,
// sem precisar repassar o erro para cada input/textarea/select do formulário
const invalidFieldClasses = [
  '[&_[data-slot=input]]:border-destructive',
  '[&_[data-slot=input]]:ring-3',
  '[&_[data-slot=input]]:ring-destructive/20',
  '[&_[data-slot=textarea]]:border-destructive',
  '[&_[data-slot=textarea]]:ring-3',
  '[&_[data-slot=textarea]]:ring-destructive/20',
  '[&_[data-slot=select-trigger]]:border-destructive',
  '[&_[data-slot=select-trigger]]:ring-3',
  '[&_[data-slot=select-trigger]]:ring-destructive/20',
].join(' ')

// Wrapper padrão label + campo + erro, usado em todo formulário do sistema
function FormFieldWrapper({
  label,
  htmlFor,
  required,
  error,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('grid min-w-0 content-start gap-1.5', error && invalidFieldClasses)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default FormFieldWrapper
