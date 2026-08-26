import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormModalFooterProps = {
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  submitVariant?: 'default' | 'destructive'
  className?: string
}

function FormModalFooter({
  onCancel,
  isSubmitting = false,
  submitLabel = 'Salva',
  submitVariant = 'default',
  className,
}: FormModalFooterProps) {
  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button type="button" variant="outline" onClick={onCancel}>
        Annulla
      </Button>
      <Button type="submit" variant={submitVariant} disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  )
}

export default FormModalFooter
