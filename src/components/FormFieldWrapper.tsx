import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

type FormFieldWrapperProps = {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}

// Wrapper padrão label + campo + erro, usado em todo formulário do sistema
function FormFieldWrapper({
  label,
  htmlFor,
  required,
  error,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export default FormFieldWrapper
