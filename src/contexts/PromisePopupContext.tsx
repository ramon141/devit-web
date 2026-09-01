import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'
import type { ToastPromiseMessages } from '@/contexts/ToastContext'

export type PromisePopupStatus = 'idle' | 'loading' | 'success' | 'error'

export type PromisePopupState = {
  status: PromisePopupStatus
  message: string
}

type PromisePopupContextValue = {
  state: PromisePopupState
  closePopup: () => void
  promisePopup: <TData>(
    promise: Promise<TData>,
    messages: ToastPromiseMessages<TData>
  ) => void
}

const PromisePopupContext = createContext<PromisePopupContextValue | undefined>(
  undefined
)

const IDLE_STATE: PromisePopupState = { status: 'idle', message: '' }

function PromisePopupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PromisePopupState>(IDLE_STATE)

  const closePopup = useCallback(() => setState(IDLE_STATE), [])

  const promisePopup = useCallback(
    <TData,>(
      promise: Promise<TData>,
      messages: ToastPromiseMessages<TData>
    ) => {
      setState({ status: 'loading', message: messages.pending })

      promise
        .then((data) => {
          const message =
            typeof messages.success === 'string'
              ? messages.success
              : messages.success(data)

          if (message) setState({ status: 'success', message })
          else setState(IDLE_STATE)
        })
        .catch((error: AxiosError<ApiErrorResponse>) => {
          const message =
            typeof messages.error === 'string'
              ? messages.error
              : messages.error(error)

          setState({
            status: 'error',
            message: message ?? getErrorMessageFromRequest(error),
          })
        })
    },
    []
  )

  return (
    <PromisePopupContext.Provider value={{ state, closePopup, promisePopup }}>
      {children}
    </PromisePopupContext.Provider>
  )
}

function usePromisePopup(): PromisePopupContextValue {
  const context = useContext(PromisePopupContext)
  if (!context)
    throw new Error(
      'usePromisePopup deve ser usado dentro de PromisePopupProvider'
    )

  return context
}

export { PromisePopupProvider, usePromisePopup }
