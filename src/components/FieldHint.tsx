import { Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldHintProps = {
  children: string
  warning?: boolean
  className?: string
}

// Dica discreta de regra de negócio, exibida junto aos campos do formulário
function FieldHint({ children, warning = false, className }: FieldHintProps) {
  const Icon = warning ? TriangleAlert : Info

  return (
    <p
      role="note"
      className={cn(
        'flex items-start gap-1.5 text-xs',
        warning ? 'text-amber-700' : 'text-muted-foreground',
        className,
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" />

      <span>{children}</span>
    </p>
  )
}

export default FieldHint
