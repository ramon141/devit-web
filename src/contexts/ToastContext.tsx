import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { TOAST_AUTO_DISMISS_MS } from '@/constants/ui'

export type ToastVariant = 'loading' | 'success' | 'error'

export type ToastEntry = {
  id: string
  variant: ToastVariant
  message: string
}

export type ToastPromiseMessages<TData> = {
  pending: string
  success: string | ((data: TData) => string | undefined)
  error: string | ((error: AxiosError<ApiErrorResponse>) => string | undefined)
}

type ToastContextValue = {
  toasts: ToastEntry[]
  dismissToast: (id: string) => void
  toastPromise: <TData>(
    promise: Promise<TData>,
    messages: ToastPromiseMessages<TData>
  ) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)



function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const settleToast = useCallback(
    (id: string, variant: ToastVariant, message?: string) => {
      if (!message) {
        dismissToast(id)
        return
      }

      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, variant, message } : toast))
      )
      setTimeout(() => dismissToast(id), TOAST_AUTO_DISMISS_MS)
    },
    [dismissToast]
  )

  const toastPromise = useCallback(
    <TData,>(promise: Promise<TData>, messages: ToastPromiseMessages<TData>) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, variant: 'loading', message: messages.pending }])

      promise
        .then((data) => {
          const message =
            typeof messages.success === 'string' ? messages.success : messages.success(data)
          settleToast(id, 'success', message)
        })
        .catch((error: AxiosError<ApiErrorResponse>) => {
          const message =
            typeof messages.error === 'string' ? messages.error : messages.error(error)
          settleToast(id, 'error', message)
        })
    },
    [settleToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, dismissToast, toastPromise }}>
      {children}
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider')

  return context
}

export { ToastProvider, useToast }
