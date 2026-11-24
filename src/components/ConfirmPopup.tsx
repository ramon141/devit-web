import { Loader2, TriangleAlert, XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type ConfirmPopupProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
  onConfirm: () => void
}

function ConfirmPopup({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  loading = false,
  onConfirm,
}: ConfirmPopupProps) {
  const { t } = useTranslation('common')
  const resolvedConfirmLabel = confirmLabel ?? t('confirmPopup.confirm')
  const resolvedCancelLabel = cancelLabel ?? t('confirmPopup.cancel')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'sm:max-w-sm',
          variant === 'destructive' && 'border-t-4 border-destructive'
        )}
        showCloseButton={false}
      >
        <DialogHeader className="items-center gap-3 pt-2 text-center">
          <div
            className={cn(
              'flex size-14 items-center justify-center rounded-full ring-8',
              variant === 'destructive'
                ? 'bg-destructive text-white ring-destructive/15'
                : 'bg-accent text-primary ring-accent/50'
            )}
          >
            <TriangleAlert className="size-6" />
          </div>
          <DialogTitle className="text-base font-semibold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="mx-0 mb-0 grid grid-cols-2 gap-3 border-0 bg-transparent p-0 pt-2">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            <XIcon data-icon="inline-start" />
            {resolvedCancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            className={cn(
              'h-10',
              variant === 'destructive' &&
                'bg-destructive text-white shadow-sm hover:bg-destructive/90'
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {resolvedConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmPopup
