import { CheckIcon, Loader2Icon, XIcon, XCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

const variantIcon = {
  loading: <Loader2Icon className="size-4 animate-spin" />,
  success: <CheckIcon className="size-4" />,
  error: <XCircleIcon className="size-4" />,
}

// Barra lateral sólida + fundo claro da mesma cor
const variantStyle = {
  loading: { bar: 'bg-primary text-primary-foreground', body: 'bg-card text-foreground' },
  success: { bar: 'bg-success text-success-foreground', body: 'bg-success/10 text-success' },
  error: {
    bar: 'bg-destructive text-white',
    body: 'bg-destructive/10 text-destructive',
  },
}

// Container fixo de toasts no canto superior direito, sem bloquear a tela
function ToastViewport() {
  const { t } = useTranslation('common')
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const style = variantStyle[toast.variant]

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'flex overflow-hidden rounded-md bg-card shadow-lg',
              'animate-in slide-in-from-right-4 fade-in-0'
            )}
          >
            <div className={cn('flex w-10 shrink-0 justify-center pt-3.5', style.bar)}>
              {variantIcon[toast.variant]}
            </div>

            <div className={cn('flex flex-1 items-start gap-2 px-4 py-3 text-sm', style.body)}>
              <span className="flex-1">{toast.message}</span>

              <button
                type="button"
                aria-label={t('promisePopup.close')}
                onClick={() => dismissToast(toast.id)}
                className="opacity-60 hover:opacity-100"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ToastViewport
