import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePopupCountdown } from '@/components/hooks/usePopupCountdown'
import { cn } from '@/lib/utils'

const statusIcon = {
  loading: <Loader2Icon className="size-14 animate-spin text-primary-foreground" />,
  success: <CheckCircle2Icon className="size-14 text-success-foreground" />,
  error: <XCircleIcon className="size-14 text-destructive-foreground" />,
}

const statusBg = {
  loading: 'bg-primary',
  success: 'bg-success',
  error: 'bg-destructive',
}

// Popup global de loading alimentado pelo promisePopup do PromisePopupContext
function PromisePopup() {
  const { t } = useTranslation('common')
  const { state, closePopup } = usePromisePopup()

  const isLoading = state.status === 'loading'
  const isSettled = state.status === 'success' || state.status === 'error'
  const open = state.status !== 'idle'
  const status = state.status === 'idle' ? 'loading' : state.status

  const secondsLeft = usePopupCountdown(isSettled, closePopup)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isLoading) closePopup()
      }}
    >
      <DialogContent
        className="flex flex-col items-center gap-5 py-8 text-center sm:max-w-xs"
        showCloseButton={false}
      >
        <div
          className={cn(
            'flex size-24 items-center justify-center rounded-full',
            statusBg[status]
          )}
        >
          {statusIcon[status]}
        </div>

        <DialogHeader className="items-center">
          <DialogTitle className="text-xl font-bold">{state.message}</DialogTitle>
        </DialogHeader>

        {isSettled && (
          <Button variant="ghost" className="font-medium" onClick={closePopup}>
            {t('promisePopup.ok')} ({secondsLeft})
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PromisePopup
