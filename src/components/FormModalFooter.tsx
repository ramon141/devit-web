import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormModalFooterProps = {
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  submitVariant?: 'default' | 'destructive'
  className?: string
  id?: string
}

function FormModalFooter({
  onCancel,
  isSubmitting = false,
  submitLabel,
  submitVariant = 'default',
  className,
  id,
}: FormModalFooterProps) {
  const { t } = useTranslation('common')
  const resolvedSubmitLabel = submitLabel ?? t('formModalFooter.save')

  return (
    <div id={id} className={cn('flex justify-end gap-2', className)}>
      <Button type="button" variant="outline" onClick={onCancel}>
        {t('formModalFooter.cancel')}
      </Button>
      <Button type="submit" variant={submitVariant} disabled={isSubmitting}>
        {resolvedSubmitLabel}
      </Button>
    </div>
  )
}

export default FormModalFooter
