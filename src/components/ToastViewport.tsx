import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

const variantIcon = {
  loading: <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />,
  success: <CheckCircle2Icon className="size-4 shrink-0 text-success" />,
  error: <XCircleIcon className="size-4 shrink-0 text-destructive" />,
}

// Container fixo de toasts, alimentado pelo toastPromise do ToastContext
function ToastViewport() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 bottom-4 z-100 flex w-full max-w-xs flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={cn(
            'flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-left text-sm ring-1 ring-border',
            'animate-in slide-in-from-bottom-2 fade-in-0'
          )}
        >
          {variantIcon[toast.variant]}
          <span className="text-foreground">{toast.message}</span>
        </button>
      ))}
    </div>
  )
}

export default ToastViewport
