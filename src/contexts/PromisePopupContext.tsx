import { useToast } from '@/contexts/ToastContext'

// ponytail: promisePopup agora é o toast do canto superior direito; mantém o nome para não mexer nos callers
function usePromisePopup() {
  const { toastPromise } = useToast()

  return { promisePopup: toastPromise }
}

export { usePromisePopup }
